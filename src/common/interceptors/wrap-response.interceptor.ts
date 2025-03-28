import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
  statusCode: number;
}

@Injectable()
export class WrapResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    // Ottieni informazioni sulla richiesta HTTP
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;
    
    return next.handle().pipe(
      map((data) => {
        // Determina il messaggio in base al codice di stato HTTP
        let message = 'Operazione completata con successo';
        if (statusCode >= 400) {
          message = 'Si è verificato un errore';
        }

        // Se data è già un oggetto conforme alla nostra struttura, ritornalo così com'è
        if (data && typeof data === 'object' && 'success' in data && 'data' in data && 'message' in data) {
          return data;
        }

        // Verifica se è già un oggetto di errore
        if (data && typeof data === 'object' && 'statusCode' in data && 'message' in data && 'error' in data) {
          return {
            success: false,
            data: null,
            message: data.message,
            timestamp: new Date().toISOString(),
            statusCode: data.statusCode
          };
        }

        // Altrimenti, formatta la risposta secondo lo standard definito
        return {
          success: statusCode < 400,
          data: data,
          message: message,
          timestamp: new Date().toISOString(),
          statusCode: statusCode
        };
      })
    );
  }
}