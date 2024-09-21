/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import configs from '../../config';
import { Product } from 'src/models/product.schema';
import { Price } from 'src/models/price.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSubscriptionDto } from './dto/index.dto';
import { User } from 'src/models/user.schema';

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

  // async attachCardToCustomer(card) {
  //   try {
  //     const paymentMethod = await this.stripe.paymentMethods.create({
  //       type: 'card',
  //       us_bank_account: {
  //         account_holder_type: 'individual',
  //         account_number: card.account_number,
  //         routing_number: '110000000',
  //       },
  //       billing_details: {
  //         name: 'John Doe',
  //       },
  //     });
  //   } catch (error) {}
  // }

  async createSetupIntent(customerId: string) {
    try {
      const setupIntent = await this.stripe.setupIntents.create({
        // payment_method_types: ['card'],
        customer: customerId,
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

  async createSubscription(body: CreateSubscriptionDto, uid: string) {
    const { prices, setupIntentId } = body;

    const user = await this.UserModel.findById(uid);

    try {
      const setupIntent = await this.stripe.setupIntents.retrieve(
        setupIntentId,
      );

      await this.stripe.customers.update(setupIntent.customer.toString(), {
        invoice_settings: {
          default_payment_method: setupIntent.payment_method.toString(),
        },
      });

      for (const price of prices) {
        await this.stripe.subscriptions.create({
          customer: user.customerId,
          items: [{ price }],
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
}
