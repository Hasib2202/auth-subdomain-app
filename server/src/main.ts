// server/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  
  app.enableCors({
    origin: [
      'http://localhost:3000',
      /^http:\/\/.*\.localhost:3000$/,
      'http://localhost:5173',
      /^http:\/\/.*\.localhost:5173$/,
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  await app.listen(8000);
}
bootstrap();