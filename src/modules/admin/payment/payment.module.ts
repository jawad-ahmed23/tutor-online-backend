import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AdminPaymentController } from './payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/models/product.schema';
import { Price, PriceSchema } from 'src/models/price.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Price.name, schema: PriceSchema },
    ]),
  ],
  controllers: [AdminPaymentController],
  providers: [PaymentService],
})
export class AdminPaymentModule {}
