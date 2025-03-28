import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { WrapResponseInterceptor } from './common/interceptors';
import { HttpExceptionFilter, AllExceptionsFilter } from './common/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Applica il ValidationPipe globalmente
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  
  // Applica il WrapResponseInterceptor globalmente
  app.useGlobalInterceptors(new WrapResponseInterceptor());
  
  // Applica il filtro per le eccezioni HTTP
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // Applica il filtro per tutte le eccezioni (deve essere dopo HttpExceptionFilter)
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  
  // Configura CORS per il frontend
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });
  
  await app.listen(process.env.PORT || 3000);
  console.log(`Applicazione in esecuzione sulla porta ${process.env.PORT || 3000}`);
}

void bootstrap();