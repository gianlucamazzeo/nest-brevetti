import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type NotificaDocument = Notifica & Document;

export enum TipoNotifica {
  SCADENZA_IMMINENTE = 'SCADENZA_IMMINENTE',
  CAMBIO_STATO = 'CAMBIO_STATO',
  NUOVA_NOTA = 'NUOVA_NOTA',
  SISTEMA = 'SISTEMA'
}

@Schema({ timestamps: true })
export class Notifica {
  @Prop({ required: true })
  titolo: string;

  @Prop({ required: true })
  messaggio: string;

  @Prop({ 
    required: true, 
    enum: TipoNotifica, 
    default: TipoNotifica.SISTEMA 
  })
  tipo: TipoNotifica;

  @Prop({ 
    type: MongooseSchema.Types.ObjectId, 
    ref: 'Brevetto',
    required: false 
  })
  brevetto?: any;

  @Prop({ 
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Utente' }],
    default: [] 
  })
  destinatari: any[];

  @Prop({ 
    type: [{ 
      utente: { type: MongooseSchema.Types.ObjectId, ref: 'Utente' },
      letta: { type: Boolean, default: false },
      dataLettura: { type: Date, default: null }
    }],
    default: [] 
  })
  statoLettura: { utente: any; letta: boolean; dataLettura: Date }[];

  @Prop({ required: true, default: false })
  inviaEmail: boolean;

  @Prop({ default: false })
  emailInviata: boolean;

  @Prop()
  dataInvioEmail?: Date;

  @Prop({ default: false })
  urgente: boolean;

  @Prop({ type: Date })
  dataScadenza?: Date;

  @Prop({ default: true })
  attiva: boolean;
}

export const NotificaSchema = SchemaFactory.createForClass(Notifica);

// Aggiungi indici per ottimizzare le query
NotificaSchema.index({ tipo: 1 });
NotificaSchema.index({ brevetto: 1 });
NotificaSchema.index({ 'statoLettura.utente': 1, 'statoLettura.letta': 1 });
NotificaSchema.index({ createdAt: -1 });
NotificaSchema.index({ urgente: 1 });