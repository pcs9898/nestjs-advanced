import { ApiProperty } from '@nestjs/swagger';

export class SignupResDto {
  @ApiProperty({ required: true }) // temp true when development
  id: string;

  @ApiProperty({ required: true })
  unVerifiedToken: string;
}

export class SigninResDto {
  @ApiProperty({})
  accessToken?: string;

  @ApiProperty({})
  refreshToken?: string;

  @ApiProperty({})
  unVerifiedToken?: string;
}

export class RestoreRefreshTokenResDto {
  @ApiProperty({ required: true })
  accessToken: string;

  @ApiProperty({ required: true })
  refreshToken: string;
}

export class VerifyEmailResDto {
  @ApiProperty({})
  accessToken: string;

  @ApiProperty({})
  refreshToken: string;
}
