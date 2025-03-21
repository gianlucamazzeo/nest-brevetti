import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TitolareDocument = Titolare & Document;

@Schema({ timestamps: true })
export class Titolare {
  @Prop({ required: true, index: true })
  nome: string;

  @Prop({ required: true })
  tipologia: 'PERSONA_FISICA' | 'AZIENDA' | 'ENTE_PUBBLICO';

  @Prop()
  codiceFiscale?: string;

  @Prop()
  partitaIva?: string;

  @Prop()
  indirizzo?: string;

  @Prop()
  citta?: string;

  @Prop()
  provincia?: string;

  @Prop()
  cap?: string;

  @Prop()
  paese?: string;

  @Prop()
  email?: string;

  @Prop()
  telefono?: string;

  @Prop({ default: true })
  attivo: boolean;

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export const TitolareSchema = SchemaFactory.createForClass(Titolare);

// Aggiungi indici per ottimizzare le query
TitolareSchema.index({ nome: 'text' });
TitolareSchema.index({ tipologia: 1 });
TitolareSchema.index({ codiceFiscale: 1 }, { sparse: true });
TitolareSchema.index({ partitaIva: 1 }, { sparse: true });