import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePriceDto, CreateProductDto } from './dto/index.dto';

@Controller('admin/payment')
export class AdminPaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('prices')
  async createPrice(@Body() body: CreatePriceDto) {
    return await this.paymentService.createPrice(body);
  }

  @Post('products')
  async createProduct(@Body() body: CreateProductDto) {
    return await this.paymentService.createProduct(body);
  }
}
