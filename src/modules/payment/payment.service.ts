import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import configs from '../../config';
import { Product } from 'src/models/product.schema';
import { Price } from 'src/models/price.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSubscriptionDto } from './dto/index.dto';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectModel(Product.name)
    private ProductModel: Model<Product>,
    @InjectModel(Price.name)
    private PriceModel: Model<Price>,
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

  async createSubscription(body: CreateSubscriptionDto) {
    const { customerId, priceId } = body;
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: priceId,
          },
        ],
        expand: ['latest_invoice.payment_intent'],
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException({ message: error.message, success: false });
    }
  }
}
