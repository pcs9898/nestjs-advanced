import {
  Logger,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from './common/config/jwt.config';
import postgresConfig from './common/config/postgres.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { VideoModule } from './apis/video/video.module';
import { UserModule } from './apis/user/user.module';
import { AuthModule } from './apis/auth/auth.module';
import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { APP_GUARD } from '@nestjs/core';
import { AccessAuthGuard } from './apis/auth/guard/jwt-access.guard';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import redisConfig from './common/config/redis.config';
import { JwtModule } from '@nestjs/jwt';
import mailConfig from './common/config/mail.config';

import { HealthModule } from './apis/health/health.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import slackConfig from './common/config/slack.config';
import sentryConfig from './common/config/sentry.config';
import { ScheduledBatchModule } from './apis/scheduled-batch/scheduled-batch.module';
import { AnalyticsModule } from './apis/analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        jwtConfig,
        postgresConfig,
        redisConfig,
        mailConfig,
        slackConfig,
        sentryConfig,
      ],
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        let obj: TypeOrmModuleOptions = {
          type: 'postgres',
          host: configService.get('postgres.host'),
          port: configService.get('postgres.port'),
          database: configService.get('postgres.database'),
          username: configService.get('postgres.username'),
          password: configService.get('postgres.password'),
          autoLoadEntities: true,
        };

        if (configService.get('NODE_ENV') === 'development') {
          console.info('Sync Typeorm');
          obj = Object.assign(obj, {
            synchronize: true,
            logging: true,
          });
        }
        return obj;
      },
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const obj = {
          readyLog: true,
          errorLog: true,
          config: {
            host: configService.get('redis.host'),
            port: configService.get('redis.port'),
            password: configService.get('redis.password'),
            db: configService.get('redis.number'),
          },
        };

        return obj;
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 5000,
        limit: 5,
      },
    ]),
    VideoModule,
    UserModule,
    AuthModule,
    JwtModule,
    ScheduledBatchModule,
    HealthModule,
    AnalyticsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessAuthGuard,
    },
    Logger,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  configue(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
