import { Controller, Get, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('prices')
  async getAllPrices(@Query('productId') productId: string) {
    return await this.paymentService.getAllPrices(productId);
  }

  @Get('products')
  async getAllProducts() {
    return await this.paymentService.getAllProducts();
  }
}
