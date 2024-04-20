import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/common/decorator/public.decorator';

@Injectable()
export class AccessAuthGuard extends AuthGuard('access') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const http = context.switchToHttp();
    const request = http.getRequest();

    if (
      request.path === '/auth/restoreRefreshToken' ||
      request.path === '/auth/verifyEmail' ||
      request.path === '/auth/resendAuthCode'
    ) {
      return true; // accessToken 인증 생략
    }

    return super.canActivate(context);
  }
}
