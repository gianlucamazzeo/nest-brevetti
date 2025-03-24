import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Utente, UtenteDocument } from './schemas/utente.schema';
import { CreateUtenteDto } from './dto/create-utente.dto';
import { UpdateUtenteDto } from './dto/update-utente.dto';

@Injectable()
export class UtentiService {
  constructor(
    @InjectModel(Utente.name) private utenteModel: Model<UtenteDocument>
  ) {}
  
  async create(createUtenteDto: CreateUtenteDto): Promise<Utente> {
    const newUtente = new this.utenteModel(createUtenteDto);
    return newUtente.save();
  }

  async findAll(options: {
    page: number;
    limit: number;
    filtri?: {
      ruolo?: string;
      attivo?: boolean;
      search?: string;
    };
  }): Promise<{ data: Utente[]; meta: any }> {
    const { page, limit, filtri } = options;
    const skip = (page - 1) * limit;
    
    // Costruisci la query con i filtri
    const query: any = {};
    
    if (filtri) {
      if (filtri.ruolo) {
        query.ruolo = filtri.ruolo;
      }
      
      if (filtri.attivo !== undefined) {
        query.attivo = filtri.attivo;
      }
      
      if (filtri.search) {
        query.$or = [
          { nome: { $regex: filtri.search, $options: 'i' } },
          { cognome: { $regex: filtri.search, $options: 'i' } },
          { email: { $regex: filtri.search, $options: 'i' } }
        ];
      }
    }
    
    // Esegui la query
    const utenti = await this.utenteModel
      .find(query)
      .select('-password -refreshToken') // Escludi campi sensibili
      .skip(skip)
      .limit(limit)
      .exec();
    
    // Conta il totale per la paginazione
    const total = await this.utenteModel.countDocuments(query).exec();
    
    return {
      data: utenti,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: string): Promise<Utente> {
    const utente = await this.utenteModel
      .findById(id)
      .select('-password -refreshToken')
      .exec();
      
    if (!utente) {
      throw new NotFoundException(`Utente con ID ${id} non trovato`);
    }
    
    return utente;
  }

  async findByEmail(email: string): Promise<UtenteDocument | null> {
    return this.utenteModel.findOne({ email }).exec();
  }

  async update(id: string, updateUtenteDto: UpdateUtenteDto): Promise<Utente> {
    const utente = await this.utenteModel
      .findByIdAndUpdate(id, updateUtenteDto, { new: true })
      .select('-password -refreshToken')
      .exec();
      
    if (!utente) {
      throw new NotFoundException(`Utente con ID ${id} non trovato`);
    }
    
    return utente;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.utenteModel.deleteOne({ _id: id }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Utente con ID ${id} non trovato`);
    }
    
    return { deleted: true };
  }

  async setRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    await this.utenteModel.updateOne(
      { _id: userId },
      { refreshToken }
    ).exec();
  }

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  async updateUltimoAccesso(userId: string | any): Promise<void> {
    const id = typeof userId === 'string' ? userId : userId.toString();
    
    await this.utenteModel.updateOne(
      { _id: id },
      { ultimoAccesso: new Date() }
    ).exec();
  }
}