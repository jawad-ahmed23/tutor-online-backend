import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../../models/product.schema';
import { Price, PriceSchema } from '../../models/price.schema';
import { User, UserSchema } from '../../models/user.schema';
import {
  Subscription,
  SubscriptionSchema,
} from '../../models/subscriptions.schema';
import { Invoice, InvoiceSchema } from 'src/models/invoices.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Price.name, schema: PriceSchema },
      { name: User.name, schema: UserSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: Invoice.name, schema: InvoiceSchema },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
