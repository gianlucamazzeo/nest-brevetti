import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    
    let message = 'Si è verificato un errore';
    let details: { error?: any; validationErrors?: string[] } | null = null;
    
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

    // Logging dell'errore
    this.logger.error(
      `${request.method} ${request.url} - ${status}: ${message}`,
      exception.stack
    );

    // Formattazione standardizzata della risposta di errore
    response.status(status).json({
      success: false,
      data: null,
      message: message,
      details: details,
      timestamp: new Date().toISOString(),
      statusCode: status,
      path: request.url,
    });
  }
}