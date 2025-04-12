import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);

  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  // Security middleware
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  // Configure CORS with specific origins
  const corsOrigins = configService.get('CORS_ORIGIN', '').split(',');
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    maxAge: 3600,
  });

  // Global validation pipe with stricter settings
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation - only in development
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Anonymous Message API')
      .setDescription('API for sending and receiving anonymous messages')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('v1')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  const port = configService.get('PORT', 3000);
  await app.listen(port);

  if (process.env.NODE_ENV !== 'production') {
    console.log(`Application is running on: ${await app.getUrl()}`);
    console.log(
      `Swagger documentation available at: ${await app.getUrl()}/docs`,
    );
  }
}
bootstrap();
