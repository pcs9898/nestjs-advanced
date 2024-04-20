import {
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshAuthGuard extends AuthGuard('refresh') {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private authService: AuthService,
    @Inject(Logger) private logger: LoggerService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const http = context.switchToHttp();
    const request = http.getRequest();

    const authorization = request.headers['authorization'];
    if (!authorization) throw new UnauthorizedException();
    if (!authorization.includes('Bearer')) throw new UnauthorizedException();

    const refreshToken = /Bearer\s(.+)/.exec(authorization)[1];
    if (!refreshToken) throw new UnauthorizedException('Token is required');

    const decoded = this.jwtService.decode(refreshToken);

    if (decoded['tokenType'] !== 'refreshToken') {
      const error = new UnauthorizedException('RefreshToken is required');
      this.logger.error(error.message, error.stack);
      throw error;
    }

    request.refreshToken = refreshToken;

    return super.canActivate(context);
  }
}
