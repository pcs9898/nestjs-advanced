import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';
import { IncomingWebhook } from '@slack/webhook';
import { Request as ExpressRequest } from 'express';
import { catchError } from 'rxjs/operators';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const http = context.switchToHttp();
    const request = http.getRequest<ExpressRequest>();
    const { url } = request;
    return next.handle().pipe(
      catchError((error) => {
        Sentry.captureException(error);
        const webhook = new IncomingWebhook(
          this.configService.get('slack.webhook'),
        );
        webhook.send({
          attachments: [
            {
              text: 'NestJS 프로젝트 에러 발생',
              fields: [
                {
                  title: `Error message: ${error.response?.message || error.message}`,
                  value: `URL: ${url}\n${error.stack}`,
                  short: false,
                },
              ],
              ts: Math.floor(new Date().getTime() / 1000).toString(),
            },
          ],
        });
        throw error;
      }),
    );
  }
}
