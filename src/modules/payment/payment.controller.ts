import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Roles } from '../../decorator/role.decorator';
import { Role } from '../../constants';
import { RolesGuard } from '../../guard/roles.guard';
import { Uid } from '../../decorator/uid.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('prices')
  async getAllPrices(@Query('productId') productId: string) {
    return await this.paymentService.getAllPrices(productId);
  }

  @Get('products')
  @UseGuards(RolesGuard)
  async getAllProducts() {
    return await this.paymentService.getAllProducts();
  }

  @Roles(Role.PARENT)
  @UseGuards(RolesGuard)
  @Post('payment-methods')
  async createPaymentMethod(@Body() body: any, @Uid() uid: string) {
    return await this.paymentService.createPaymentMethod(body, uid);
  }

  @Roles(Role.PARENT)
  @UseGuards(RolesGuard)
  @Post('subscriptions')
  async createSubscription(@Body() body: any, @Uid() uid: string) {
    return await this.paymentService.createSubscription(body, uid);
  }
}
