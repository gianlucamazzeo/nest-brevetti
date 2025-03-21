import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { StatoBrevetto } from '../enums/stato.brevetto.enums';
import { Titolare } from '../../titolari/schemas/titolare.schema';

export type BrevettoDocument = Brevetto & Document;

@Schema({ timestamps: true })
export class Brevetto {
  @Prop({ required: true, index: true })
  numero: string;

  @Prop({ required: true })
  titolo: string;

  @Prop({ required: true })
  descrizione: string;

  @Prop({ required: true, enum: StatoBrevetto, default: StatoBrevetto.DEPOSITO })
  stato: StatoBrevetto;

  @Prop({ required: true, type: Date })
  dataDeposito: Date;

  @Prop({ type: Date })
  dataConcessione?: Date;

  @Prop({ required: true, type: Date })
  dataScadenza: Date;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Titolare' }])
  titolari: Titolare[];

  @Prop({ type: [String] })
  inventori: string[];

  @Prop({ type: [String] })
  classificazioneIPC: string[];

  @Prop({ type: Object })
  metadata: Record<string, any>;

  @Prop([{ 
    data: { type: Date, required: true },
    descrizione: { type: String, required: true }
  }])
  timeline: { data: Date; descrizione: string }[];

  @Prop([{ 
    testo: { type: String, required: true }, 
    autore: { type: String, required: true }, 
    data: { type: Date, default: Date.now }
  }])
  note: { testo: string; autore: string; data: Date }[];
}

export const BrevettoSchema = SchemaFactory.createForClass(Brevetto);

// Aggiungi indici per ottimizzare le query frequenti
BrevettoSchema.index({ stato: 1 });
BrevettoSchema.index({ dataScadenza: 1 });
BrevettoSchema.index({ titolari: 1 });