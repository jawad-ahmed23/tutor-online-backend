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

  // @ApiProperty()
  // freeSessionDate: [string];

  @ApiProperty()
  priceId: string;

  @ApiProperty()
  freeSessions: string[];
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

class Prices {
  @ApiProperty()
  priceId: string;

  @ApiProperty()
  studentId: string;
}

export class AddStudentsDto {
  @ApiProperty()
  students: [StudentDto];

  @ApiProperty()
  proceedToPayment: boolean;

  @ApiProperty()
  prices: Prices[];
}

export class AddComplaintDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;
}

export class SessionSwapDto {
  // currentSession: "2024-10-10T09:00:00.000Z"
  // reason: "fsdfdsfdsfsdf"
  // requestFor: "makeover"
  // student: "6701865bdad2dce81c135945"
  // swapSession: "2024-10-09T08:00:00.000Z"

  @ApiProperty()
  currentSession: string;

  @ApiProperty()
  reason: string;

  @ApiProperty()
  requestFor: string;

  @ApiProperty()
  student: string;

  @ApiProperty()
  swapSession: string;
}
