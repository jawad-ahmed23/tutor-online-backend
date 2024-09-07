import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  role: 'parent' | 'student';

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  password: string;
}

export class LoginDto {
  @ApiProperty()
  email?: string;

  @ApiProperty()
  username?: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  role: string;
}

export class VerifyEmailDto {
  @ApiProperty()
  code: string;
}
