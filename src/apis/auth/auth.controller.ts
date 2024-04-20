import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import {
  SigninResDto,
  SignupResDto,
  RestoreRefreshTokenResDto,
  VerifyEmailResDto,
} from './dto/res.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorator/public.decorator';
import { ApiPostResponse } from 'src/common/decorator/swagger.decorator';
import { SigninReqDto, SignupReqDto, VerifyEmailReqDto } from './dto/req.dto';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { IAuthUser } from 'src/common/types/global-types';
import { RefreshAuthGuard } from './guard/jwt-refresh.guard';
import { UnVerifiedAuthGuard } from './guard/jwt-unVerified.guard';
import { AccessAuthGuard } from './guard/jwt-access.guard';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Auth')
@ApiExtraModels(
  SignupResDto,
  SigninResDto,
  RestoreRefreshTokenResDto,
  VerifyEmailResDto,
)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @ApiPostResponse(SignupResDto)
  @Post('signup')
  async signup(@Body() data: SignupReqDto): Promise<SignupResDto> {
    return await this.authService.signup(data);
  }

  @Public()
  @ApiPostResponse(SigninResDto)
  @Throttle({ default: { limit: 3, ttl: 5000 } })
  @Post('signin')
  async signin(@Body() data: SigninReqDto): Promise<SigninResDto> {
    return await this.authService.signin(data);
  }

  @ApiBearerAuth()
  @UseGuards(UnVerifiedAuthGuard)
  @ApiPostResponse(VerifyEmailResDto)
  @Post('verifyEmail')
  async verifyEmail(
    @GetUser() { id }: IAuthUser,
    @Body() { authCode }: VerifyEmailReqDto,
  ): Promise<VerifyEmailResDto> {
    return await this.authService.verifyEmail({ user_id: id, authCode });
  }

  @ApiBearerAuth()
  @UseGuards(UnVerifiedAuthGuard)
  @ApiPostResponse(VerifyEmailResDto)
  @Post('resendAuthCode')
  async resendAuthCode(@GetUser() { id }: IAuthUser): Promise<boolean> {
    return await this.authService.resendAuthCode({ user_id: id });
  }

  @ApiBearerAuth()
  @UseGuards(RefreshAuthGuard)
  @ApiPostResponse(RestoreRefreshTokenResDto)
  @Post('restoreRefreshToken')
  async restoreRefreshToken(
    @Request() { refreshToken },
    @GetUser() { id }: IAuthUser,
  ): Promise<RestoreRefreshTokenResDto> {
    return await this.authService.restoreAccessToken({
      id,
      refreshToken,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AccessAuthGuard)
  @Post('signout')
  async signout(@GetUser() { id }: IAuthUser): Promise<boolean> {
    return await this.authService.signout({ user_id: id });
  }
}
