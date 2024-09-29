import { ApiProperty } from '@nestjs/swagger';

export class StudentDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  dateOfBirth: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  groupYear: string;

  @ApiProperty()
  subjects: string[];

  @ApiProperty()
  daysPerWeek: number;

  @ApiProperty()
  freeSessionDate: [string];
}

class paymentDetailsDto {
  @ApiProperty()
  cardNumber: string;

  @ApiProperty()
  expirationDate: string;

  @ApiProperty()
  cvv: string;

  @ApiProperty()
  cardholderName: string;
}

export class AddStudentsDto {
  @ApiProperty()
  students: [StudentDto];

  @ApiProperty()
  proceedToPayment: boolean;

  @ApiProperty()
  priceId: string;
}

export class AddComplaintDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;
}
