import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Implementazione base dell'AuthGuard JWT
    return super.canActivate(context);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRequest(err: any, user: any, _info: any) {
    // Se c'è un errore o l'utente non è stato trovato
    if (err || !user) {
      throw err || new UnauthorizedException('Accesso non autorizzato: autenticazione richiesta');
    }
    
    // Se l'utente non è attivo
    if (!user.attivo) {
      throw new UnauthorizedException('Account utente disattivato');
    }
    
    // Aggiorna l'ultimo accesso dell'utente se necessario
    // Questo può essere gestito separatamente nel service

    return user;
  }
}