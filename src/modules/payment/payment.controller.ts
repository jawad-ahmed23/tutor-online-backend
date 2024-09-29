import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Patch,
  Post,
  Query,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Roles } from '../../decorator/role.decorator';
import { Role } from '../../constants';
import { RolesGuard } from '../../guard/roles.guard';
import { Uid } from '../../decorator/uid.decorator';
import { AttachPaymentMethodToUserDto } from './dto/index.dto';

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

  @Roles(Role.PARENT)
  @UseGuards(RolesGuard)
  @Get('subscriptions')
  async getUserSubscriptions(@Uid() uid: string) {
    return await this.paymentService.getUserSubscriptions(uid);
  }

  @Roles(Role.PARENT)
  @UseGuards(RolesGuard)
  @Get('invoices')
  async getUserInvoices(@Uid() uid: string) {
    return await this.paymentService.getUserInvoices(uid);
  }

  @Roles(Role.PARENT)
  @UseGuards(RolesGuard)
  @Post('setup-intent')
  async createSetupIntent(@Uid() uid: string) {
    return await this.paymentService.createSetupIntent(uid);
  }

  @Roles(Role.PARENT)
  @UseGuards(RolesGuard)
  @Get('cards')
  async getUserCards(@Uid() uid: string) {
    return await this.paymentService.getUserCards(uid);
  }

  @Roles(Role.PARENT)
  @UseGuards(RolesGuard)
  @Delete('cards')
  async removePaymentMethod(@Body() body: { pId: string }, @Uid() uid: string) {
    return await this.paymentService.removePaymentMethod(body, uid);
  }

  @Roles(Role.PARENT)
  @UseGuards(RolesGuard)
  @Patch('cards/set-default')
  async setDefaultPaymentMethod(
    @Body() body: { pId: string },
    @Uid() uid: string,
  ) {
    return await this.paymentService.setDefaultPaymentMethod(body, uid);
  }

  @Roles(Role.PARENT)
  @UseGuards(RolesGuard)
  @Get('info')
  async getUserPaymentInfo(@Uid() uid: string) {
    return await this.paymentService.getUserPaymentInfo(uid);
  }

  @Roles(Role.PARENT)
  @UseGuards(RolesGuard)
  @Post('attach-card')
  async attachPaymentMethodToUser(
    @Body() body: AttachPaymentMethodToUserDto,
    @Uid() uid: string,
  ) {
    return await this.paymentService.attachPaymentMethodToUser(uid, body);
  }

  @Post('webhook')
  async webhook(
    @Headers('stripe-signature') stripeSignature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    return this.paymentService.webhook(stripeSignature, req.rawBody);
  }
}
