import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}

export class CreatePriceDto {
  @ApiProperty()
  currency: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  daysPerWeek: number;

  @ApiProperty()
  productName: string;
}
