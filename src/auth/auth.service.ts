import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Utente, UtenteDocument } from '../utenti/schemas/utente.schema';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Utente.name) private utenteModel: Model<UtenteDocument>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    // Cerca l'utente nella collection 'utentes'
    const utente = await this.utenteModel.findOne({ email }).exec();
    
    if (!utente) {
      console.log(`Utente con email ${email} non trovato`);
      return null;
    }
    
    // Utilizzo del metodo comparePassword definito nello schema utente
    const isPasswordValid = await utente.comparePassword(password);
    
    if (!isPasswordValid) {
      console.log('Password non valida');
      return null;
    }
    
    return utente;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    const utente = await this.validateUser(email, password);
    
    if (!utente) {
      throw new UnauthorizedException('Credenziali non valide');
    }
    
    // Verifica se l'utente è attivo
    if (!utente.attivo) {
      throw new UnauthorizedException('Account utente disattivato');
    }
    
    // Aggiorna ultimo accesso
    await this.utenteModel.findByIdAndUpdate(
      utente._id,
      { ultimoAccesso: new Date() },
    ).exec();
    
    // Crea payload per JWT
    const payload = { 
      email: utente.email, 
      sub: utente._id,
      ruolo: utente.ruolo
    };
    
    
    return {
      accessToken: this.jwtService.sign(payload),
      utente: {
        id: utente._id,
        email: utente.email,
        nome: utente.nome,
        cognome: utente.cognome,
        ruolo: utente.ruolo
      }
    };
  }
}