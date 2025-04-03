import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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
  
  
  // Applica il filtro per tutte le eccezioni (deve essere dopo HttpExceptionFilter)
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalFilters(
    new AllExceptionsFilter(httpAdapterHost),
    new HttpExceptionFilter()
  );
 
  
 // Applica il WrapResponseInterceptor globalmente
 app.useGlobalInterceptors(new WrapResponseInterceptor());

  // Configura CORS per il frontend
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

   // Configurazione Swagger
   const config = new DocumentBuilder()
   .setTitle('UfficioBrevetti API')
   .setDescription('API per la gestione di brevetti, marchi e design industriali')
   .setVersion('1.0')
   .addTag('brevetti')
   .addTag('titolari')
   .addTag('utenti')
   .addTag('notifiche')
   .addBearerAuth()
   .build();

   const document = SwaggerModule.createDocument(app, config);
   SwaggerModule.setup('api', app, document);
  
  await app.listen(process.env.PORT || 3000);
  console.log(`Applicazione in esecuzione sulla porta ${process.env.PORT || 3000}`);
}

void bootstrap();