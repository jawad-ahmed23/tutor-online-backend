import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePriceDto, CreateProductDto } from './dto/index.dto';
import configs from '../../../config';
import { Product } from 'src/models/product.schema';
import { Price } from 'src/models/price.schema';

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

  async createPlan() {
    return 'this is add new plan';
  }

  async createPrice(body: CreatePriceDto) {
    const { currency, amount, productId, daysPerWeek } = body;

    try {
      const price = await this.stripe.prices.create({
        currency: currency,
        product: productId,
        unit_amount: amount,
        metadata: {
          daysPerWeek: daysPerWeek,
        },
        recurring: {
          interval: 'month',
        },
      });

      await this.PriceModel.create({
        amount: amount / 100,
        currency: currency,
        daysPerWeek: daysPerWeek,
        priceId: price.id,
        productId: productId,
      });

      return {
        success: true,
        message: 'Product created successfully',
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException({ message: error.message, success: false });
    }
  }

  async createProduct(body: CreateProductDto) {
    const { name, description } = body;

    try {
      const product = await this.stripe.products.create({
        name: name,
        description: description,
      });

      await this.ProductModel.create({
        name,
        description,
        productId: product.id,
      });

      return {
        success: true,
        message: 'Product created successfully',
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException({ message: error.message, success: false });
    }
  }
}
