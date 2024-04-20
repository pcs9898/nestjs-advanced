// get-ip.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetIp = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    // 프록시를 거치는 경우 X-Forwarded-For 헤더에서 IP 주소를 가져옵니다.
    const clientIp =
      request.headers['x-forwarded-for'] ||
      request.connection.remoteAddress ||
      request.ip;
    return clientIp;
  },
);
