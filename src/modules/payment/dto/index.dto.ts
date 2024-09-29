import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty()
  prices: string[];

  @ApiProperty()
  setupIntentId: string;

  @ApiProperty()
  paymentMethodId?: string;
}

export class AttachPaymentMethodToUserDto {
  @ApiProperty()
  setupIntentId: string;
}
