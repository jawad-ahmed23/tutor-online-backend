/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Stripe from 'stripe';
import configs from '../../config';
import { Product } from 'src/models/product.schema';
import { Price } from 'src/models/price.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AttachPaymentMethodToUserDto,
  CreateSubscriptionDto,
} from './dto/index.dto';
import { User } from 'src/models/user.schema';
import { Subscription } from 'src/models/subscriptions.schema';
import config from '../../config';
import { Invoice } from 'src/models/invoices.schema';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectModel(Product.name)
    private ProductModel: Model<Product>,
    @InjectModel(Price.name)
    private PriceModel: Model<Price>,
    @InjectModel(User.name)
    private UserModel: Model<User>,
    @InjectModel(Invoice.name)
    private InvoiceModel: Model<Invoice>,
    @InjectModel(Subscription.name)
    private SubscriptionModel: Model<Subscription>,
  ) {
    this.stripe = new Stripe(configs().STRIPE.SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
  }

  async getAllPrices(productId?: string) {
    try {
      const productIdFilter = productId ? { productId } : {};

      const prices = await this.PriceModel.find({
        ...productIdFilter,
      });

      return {
        success: true,
        prices: prices,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException({ message: error.message, success: false });
    }
  }

  async getAllProducts() {
    try {
      const products = await this.ProductModel.find();

      return {
        success: true,
        products: products,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException({ message: error.message, success: false });
    }
  }

  async createSetupIntent(uid: string) {
    try {
      const user = await this.UserModel.findById(uid);

      if (!user) {
        throw new NotFoundException({
          success: false,
          message: 'User Not Found',
        });
      }

      const setupIntent = await this.stripe.setupIntents.create({
        customer: user.customerId,
      });

      return {
        client_secret: setupIntent.client_secret,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException({ message: error.message, success: false });
    }
  }

  async createPaymentMethod(
    body: {
      card: {
        number: string;
        exp_month: number;
        exp_year: number;
        cvc: string;
      };
      billing_details: {
        name: string;
      };
    },
    uid: string,
  ) {
    const { card, billing_details } = body;
    try {
      const user = await this.UserModel.findById(uid);

      const { id } = await this.stripe.paymentMethods.create({
        type: 'card',
        card,
        billing_details,
      });

      await this.stripe.paymentMethods.attach(id, {
        customer: user.customerId,
      });

      return {
        success: true,
        message: 'Payment method attached to custer.',
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException({ message: error.message, success: false });
    }
  }

  async setDefaultPaymentMethod(body: { pId: string }, uid: string) {
    try {
      const user = await this.UserModel.findById(uid);

      const { pId } = body;

      if (!user) {
        throw new NotFoundException({
          success: false,
          message: 'User Not Found!',
        });
      }

      await this.stripe.customers.update(user.customerId, {
        invoice_settings: {
          default_payment_method: pId,
        },
      });

      return {
        success: true,
        message: 'Set default payment method successfully!',
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException({ message: error.message, success: false });
    }
  }

  async removePaymentMethod(body: { pId: string }, uid: string) {
    try {
      const user = await this.UserModel.findById(uid);

      const { pId } = body;

      if (!user) {
        throw new NotFoundException({
          success: false,
          message: 'User Not Found!',
        });
      }

      await this.stripe.paymentMethods.detach(pId);

      return {
        success: true,
        message: 'Payment method removed successfully',
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException({ message: error.message, success: false });
    }
  }

  async startSubscription(body: { sId: string }, uid: string) {
    try {
      const user = await this.UserModel.findById(uid);

      const { sId } = body;

      if (!user) {
        throw new NotFoundException({
          success: false,
          message: 'User Not Found!',
        });
      }

      const subscription = await this.SubscriptionModel.find({
        userId: uid,
        subscriptionId: sId,
      });

      if (!subscription) {
        throw new NotFoundException({
          success: false,
          message: 'Subscription Not Found!',
        });
      }
    } catch (error) {}
  }

  async getUserCards(uid: string) {
    try {
      const user = await this.UserModel.findById(uid);

      if (!user) {
        throw new NotFoundException({
          success: false,
          message: 'User not found!',
        });
      }

      // Retrieve the default payment method for the customer
      const customer = await this.stripe.customers.retrieve(user.customerId);

      const defaultPaymentMethodId =
        // @ts-ignore
        customer.invoice_settings?.default_payment_method;

      // Retrieve the list of payment methods
      const paymentMethods = await this.stripe.customers.listPaymentMethods(
        user.customerId,
        { type: 'card' }, // specifying 'card' to list only card payment methods
      );

      const uniqueCards = [];

      paymentMethods.data.forEach((card) => {
        const isExists = uniqueCards.find((c) => c.last4 === card.card.last4);

        if (!isExists) {
          uniqueCards.push({
            id: card.id,
            exp_year: card.card.exp_year,
            exp_month: card.card.exp_month,
            last4: card.card.last4,
            type: card.card.brand,
            default: card.id === defaultPaymentMethodId, // Mark as default if it matches the default payment method
          });
        }
      });

      return {
        success: true,
        cards: uniqueCards,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(`Get Cards ERROR: ${error.message}`);
    }
  }

  async attachPaymentMethodToUser(
    uid: string,
    body: AttachPaymentMethodToUserDto,
  ) {
    const { setupIntentId } = body;

    try {
      const user = await this.UserModel.findById(uid);

      if (!user) {
        throw new NotFoundException({
          success: false,
          message: 'User not Found!',
        });
      }

      const setupIntent = await this.stripe.setupIntents.retrieve(
        setupIntentId,
      );

      await this.stripe.customers.update(setupIntent.customer.toString(), {
        invoice_settings: {
          default_payment_method: setupIntent.payment_method.toString(),
        },
      });

      return {
        success: true,
        message: 'Payment method attached to user successfully!',
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException({ success: false, message: error.message });
    }
  }

  async createSubscription(body: CreateSubscriptionDto, uid: string) {
    const { prices, setupIntentId } = body;

    const user = await this.UserModel.findById(uid);

    try {
      if (setupIntentId) {
        const setupIntent = await this.stripe.setupIntents.retrieve(
          setupIntentId,
        );

        await this.stripe.customers.update(setupIntent.customer.toString(), {
          invoice_settings: {
            default_payment_method: setupIntent.payment_method.toString(),
          },
        });
      }

      for (const priceId of prices) {
        const price = await this.stripe.prices.retrieve(priceId);

        const product = await this.stripe.products.retrieve(
          price.product.toString(),
        );

        const options = {
          customer: user.customerId,
          items: [{ price: priceId }],
          metadata: {
            uid: uid,
          },
        };

        const subscription = await this.stripe.subscriptions.create(options);

        // store subscriptions info in mongodb
        await this.SubscriptionModel.create({
          startDate: new Date(),
          status: subscription.status,
          subscriptionId: subscription.id,
          userId: uid,
          name: product.name,
          amount: price.unit_amount / 100,
          currency: price.currency,
        });

        await this.InvoiceModel.create({
          amount: price.unit_amount / 100,
          currency: price.currency,
          invoiceId: subscription.latest_invoice,
          status: subscription.status,
          userId: uid,
        });
      }

      return {
        success: true,
        message: 'Subscriptions created successfully!',
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException({ message: error.message, success: false });
    }
  }

  async createIncompleteSubscription(uid: string, prices: string[]) {
    try {
      const user = await this.UserModel.findById(uid);

      if (!user) {
        throw new NotFoundException({
          success: false,
          message: 'User Not Found!',
        });
      }

      for (const priceId of prices) {
        const price = await this.stripe.prices.retrieve(priceId);

        const product = await this.stripe.products.retrieve(
          price.product.toString(),
        );

        const subscription = await this.stripe.subscriptions.create({
          customer: user.customerId,
          items: [{ price: priceId }],
          metadata: {
            uid: uid,
          },
          payment_behavior: 'default_incomplete',
          expand: ['latest_invoice.payment_intent'],
        });

        // store subscriptions info in mongodb
        await this.SubscriptionModel.create({
          startDate: new Date(),
          status: subscription.status,
          subscriptionId: subscription.id,
          userId: uid,
          name: product.name,
          amount: price.unit_amount / 100,
          currency: price.currency,
          paymentIntent:
            // @ts-ignore
            subscription.latest_invoice.payment_intent.client_secret,
        });
      }

      return {
        success: true,
        message: 'Subscriptions created successfully!',
      };
    } catch (error) {}
  }

  async getUserSubscriptions(uid: string) {
    try {
      const user = await this.UserModel.findById(uid);

      if (!user) {
        throw new NotFoundException({
          success: false,
          message: 'user not found!',
        });
      }

      const subscriptions = await this.SubscriptionModel.find({
        userId: uid,
      });

      return { success: true, subscriptions };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(`${error.message}`);
    }
  }

  async getUserInvoices(uid: string) {
    try {
      const user = await this.UserModel.findById(uid);

      if (!user) {
        throw new NotFoundException({
          success: false,
          message: 'user not found!',
        });
      }

      const invoicesDocs = await this.InvoiceModel.find({
        userId: uid,
      });

      console.log('invoicesDocs', invoicesDocs);

      const invoices = await Promise.all(
        invoicesDocs.map(async (_invoice) => {
          const invoice = await this.stripe.invoices.retrieve(
            _invoice.invoiceId,
          );

          return {
            // @ts-ignore
            ..._invoice._doc,
            invoicePdf: invoice.invoice_pdf,
          };
        }),
      );

      return { success: true, invoices };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(`${error.message}`);
    }
  }

  async getUserPaymentInfo(uid: string) {
    try {
      const cardsRes = await this.getUserCards(uid);
      const subscriptionsRes = await this.getUserSubscriptions(uid);
      const invoicesRes = await this.getUserInvoices(uid);

      return {
        success: true,
        info: {
          cards: cardsRes.cards,
          subscriptions: subscriptionsRes.subscriptions,
          invoices: invoicesRes.invoices,
        },
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException({
        success: true,
        message: `Get PaymentInfo ERROR: ${error.message}`,
      });
    }
  }

  async webhook(stripeSignature: string, body: any) {
    try {
      let event: Stripe.Event;
      console.log('webhook triggered');

      try {
        event = this.stripe.webhooks.constructEvent(
          body,
          stripeSignature,
          config().STRIPE.WEBHOOK_SECRET_KEY,
        );
      } catch (error) {
        console.log(error);
        throw new BadRequestException(`Webhook Error: ${error.message}`);
      }

      console.log('Event Type', event.type);

      switch (event.type) {
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException(`Webhook Error: ${error.message}`);
    }
  }
}
