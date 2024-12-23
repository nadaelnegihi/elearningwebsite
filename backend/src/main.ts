import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { existsSync } from 'fs';
import { ValidationPipe } from '@nestjs/common';

// Load environment variables from .env file (if it exists)
const envPath = './.env';
if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('Environment variables loaded from .env');
} else {
  console.warn('.env file not found, relying on system environment variables.');
}

async function bootstrap() {
  try {
    console.log('Initializing application...');
    
    // Log the environment configuration for debugging
    console.log('PORT:', process.env.PORT || 3000);
    console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN || 'http://localhost:3000');

    const app = await NestFactory.create(AppModule);

    // Enable CORS with dynamic origin based on environment variable
    app.enableCors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Use .env or fallback to localhost
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true, // Allow credentials (cookies)
      allowedHeaders: ['Authorization', 'Content-Type'], // Allow specific headers
    });

    // Use global validation pipe for input validation
    app.useGlobalPipes(new ValidationPipe());

    // Log application status
    const port = parseInt(process.env.PORT, 10) || 3000;
    console.log(`Application running on: http://localhost:${port}`);
    await app.listen(port);
  } catch (error) {
    console.error('Error during application bootstrap:', error.message);
    process.exit(1); // Exit the process with an error code
  }
}

bootstrap();
