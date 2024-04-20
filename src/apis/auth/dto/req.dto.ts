import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, MinLength } from 'class-validator';
import { IsLength } from 'src/common/decorator/Is-length.decorator';

export class SignupReqDto {
  @ApiProperty({ required: true, example: 'aa@a.com' })
  @MinLength(4)
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: true, example: '1234' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: true, example: '1234' })
  @IsNotEmpty()
  passwordConfirm: string;
}

export class SigninReqDto {
  @ApiProperty({ required: true, example: 'aa@a.com' })
  @MinLength(4)
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: true, example: '1234' })
  @IsNotEmpty()
  @MinLength(3)
  password: string;
}

export class VerifyEmailReqDto {
  @ApiProperty({ required: true, example: '000000' })
  @IsNotEmpty()
  @IsInt()
  @IsLength(6, { message: 'authCode must be $constraint1 digits' })
  authCode: number;
}
