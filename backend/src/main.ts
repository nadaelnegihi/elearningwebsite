import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { existsSync } from 'fs';
import { ValidationPipe } from '@nestjs/common';

const envPath = './.env';
if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('Environment variables loaded from .env');
} else {
  console.error('.env file not found');
}

async function bootstrap() {
  console.log('PORT:', process.env.PORT); // Log the PORT value
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // Frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (cookies)
    allowedHeaders: ['Authorization', 'Content-Type'],
  });
  
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT || 3000;
  console.log(`Application running on port: ${port}`);
  await app.listen(port);
  
}
bootstrap();