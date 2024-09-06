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
  subject: string;

  @ApiProperty()
  daysPerWeek: number;

  @ApiProperty()
  freeSessionDate: [string];
}

export class AddStudentsDto {
  @ApiProperty()
  students: [StudentDto];
}

export class AddComplaintDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;
}
