import { Catch, ArgumentsHost, HttpException, HttpStatus, ExceptionFilter, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { MongoError } from 'mongodb';

// Interfaccia estesa per gli errori di MongoDB con proprietà aggiuntive
interface MongoDBDuplicateKeyError extends MongoError {
  keyValue?: Record<string, any>;
  writeErrors?: Array<{ 
    keyValue?: Record<string, any>;
    [key: string]: any;
  }>;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  // Metodo helper per estrarre informazioni sulla chiave duplicata dal messaggio di errore
  private extractDuplicateKeyFromMessage(message: string): Record<string, any> | string {
    try {
      // Il messaggio di errore E11000 spesso contiene il campo duplicato nel formato:
      // "E11000 duplicate key error collection: db.collection index: field_1 dup key: { field: value }"
      const matches = message.match(/index:\s+(?:.*\$)?(\w+).*\s+dup key:\s+{\s+.*:\s+"?([^"]+)"?\s+}/);
      
      if (matches && matches.length >= 3) {
        const [, field, value] = matches; // omettere il nome della variabile nella destrutturazione
        return { [field]: value };
      }
    } catch (err) {
      this.logger.warn('Failed to parse duplicate key from error message', err);
    }
    
    return 'Chiave duplicata (dettagli non disponibili)';
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    // durante l'avvio dell'applicazione. In tal caso, non facciamo nulla
    if (!this.httpAdapterHost) {
      return;
    }

    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    // Gestione di diverse tipologie di errori
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Si è verificato un errore imprevisto';
    let details: { error?: any; validationErrors?: string[]; name?: string; duplicateKey?: any } | null = null;

    // Errori HTTP NestJS
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object') {
        message = exceptionResponse['message'] || message;
        details = exceptionResponse['error'] ? { error: exceptionResponse['error'] } : null;
        
        if (Array.isArray(exceptionResponse['message'])) {
          message = 'Errore di validazione';
          details = { validationErrors: exceptionResponse['message'] };
        }
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }
    } 
    // Errori MongoDB
    else if (exception instanceof MongoError) {
      if (exception.code === 11000) {
        // Errore di duplicato (unique index)
        statusCode = HttpStatus.CONFLICT;
        message = 'Errore di duplicazione dati';
        
        // Cast all'interfaccia estesa che include keyValue
        const mongoError = exception as MongoDBDuplicateKeyError;
        
        details = { 
          duplicateKey: mongoError.keyValue || 
                        mongoError.writeErrors?.[0]?.keyValue ||
                        this.extractDuplicateKeyFromMessage(mongoError.message)
        };
      }
    } 
    // Errori generici JavaScript
    else if (exception instanceof Error) {
      message = exception.message || message;
      details = { name: exception.name };
    }

    // Log dell'errore
    const stack = exception instanceof Error ? exception.stack : undefined;
    this.logger.error(
      `${request?.method} ${request?.url} - ${statusCode}: ${message}`,
      stack
    );

    // Formato standardizzato della risposta di errore
    const responseBody = {
      success: false,
      data: null,
      message: message,
      details: details,
      timestamp: new Date().toISOString(),
      statusCode: statusCode,
      path: request?.url,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}