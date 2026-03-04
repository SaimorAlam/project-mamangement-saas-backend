import { NestFactory } from '@nestjs/core';
if (!globalThis.crypto) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  globalThis.crypto = require('node:crypto');
}
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './swagger/swagger.setup';
import * as cookieParser from 'cookie-parser';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    bodyParser: true,
  });
  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  app.set('trust proxy', true);

  //add new for upload file
  app.use('/uploads-file', express.static(join(process.cwd(), 'uploads-file')));

  // Global success response formatting
  app.useGlobalInterceptors(new TransformInterceptor());

  // Global error response formatting
  app.useGlobalFilters(new GlobalExceptionFilter());

  //here add global pipe line for validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  //here add global prefix for api
  app.setGlobalPrefix('/api/v1');
  app.use(cookieParser());

  const config = app.get(ConfigService);
  const port = config.get('port') || 3000;
  const node_env = config.get('node_env') || 'development';
  if (node_env !== 'production') {
    setupSwagger(app);
  }

  await app.listen(port);
  console.log(`🚀 Application is running successfully! port number ${port}`);
}
bootstrap().catch((err) => {
  console.error('❌ Error during bootstrap:', err);
  process.exit(1);
});
