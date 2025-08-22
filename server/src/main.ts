// server/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  // Production CORS configuration for Render + Vercel
  const corsOrigins = process.env.NODE_ENV === 'production'
    ? [
      'https://auth-subdomain-client-mh3ehf9wt-hasib2202s-projects.vercel.app',
      /^https:\/\/.*\.vercel\.app$/,
      /^https:\/\/.*\.onrender\.com$/,
    ]
    : [
      'http://localhost:3000',
      /^http:\/\/.*\.localhost:3000$/,
      'http://localhost:5173',
      /^http:\/\/.*\.localhost:5173$/,
    ];

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`🚀 Server running on port ${port}`);
}
bootstrap();