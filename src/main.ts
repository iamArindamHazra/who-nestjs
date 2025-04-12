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

  // Add request logging middleware
  app.use((req, res, next) => {
    console.log(`${req.method}: ${req.url}`);
    next();
  });

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
      .setDescription(
        'API for sending and receiving anonymous messages\n\n' +
          '## Authentication\n\n' +
          'To use protected endpoints, you need to:\n' +
          '1. Login using the `/api/v1/auth/login` endpoint with your credentials\n' +
          '2. From the response, copy ONLY the `access_token` value (without quotes)\n' +
          '3. Click the "Authorize" button at the top\n' +
          '4. In the "Value" field, paste ONLY the token value\n' +
          '5. Click "Authorize"\n\n',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Version 1 (v1)')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    // Add security requirements
    document.security = [{ bearer: [] }];

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
