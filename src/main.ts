import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
// import * as csurf from 'csurf';
import helmet from 'helmet';
import * as Sentry from '@sentry/node';
import { SentryInterceptor } from './common/interceptor/sentry.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => {
          return `${Object.values(error.constraints)}`;
        });

        return new BadRequestException(messages.toString());
      },
    }),
  );

  // security
  // app.use(csurf());
  app.use(helmet());

  // Swagger 설정을 위한 DocumentBuilder를 생성합니다.
  const config = new DocumentBuilder()
    .setTitle('Example API') // API 문서의 제목
    .setDescription('The Example API description') // API의 설명
    .setVersion('1.0') // API의 버전
    .addTag('example') // 태그 추가 (예: 기능별로 태그를 분류할 수 있음)
    .addBearerAuth()
    // 필요에 따라 추가적인 설정을 여기에 포함시킬 수 있습니다.
    .build();

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  // Swagger 문서 객체를 생성합니다.
  const document = SwaggerModule.createDocument(app, config);

  // Swagger 모듈을 설정합니다. '/api' 경로에 Swagger UI를 제공합니다.
  SwaggerModule.setup('api', app, document, customOptions);

  // Sentry

  Sentry.init({ dsn: configService.get('sentry.dsn') });
  app.useGlobalInterceptors(new SentryInterceptor(configService));

  await app.listen(3000);
  console.info(`NODE_ENV: ${configService.get('NODE_ENV')}`);
}
bootstrap();
