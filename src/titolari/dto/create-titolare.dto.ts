import { IsString, IsEnum, IsOptional, IsBoolean, IsObject, ValidateIf } from 'class-validator';

export class CreateTitolareDto {
  @IsString()
  nome: string;

  @IsEnum(['PERSONA_FISICA', 'AZIENDA', 'ENTE_PUBBLICO'])
  tipologia: 'PERSONA_FISICA' | 'AZIENDA' | 'ENTE_PUBBLICO';

  @IsOptional()
  @IsString()
  @ValidateIf(o => o.tipologia === 'PERSONA_FISICA')
  codiceFiscale?: string;

  @IsOptional()
  @IsString()
  @ValidateIf(o => o.tipologia === 'AZIENDA' || o.tipologia === 'ENTE_PUBBLICO')
  partitaIva?: string;

  @IsOptional()
  @IsString()
  indirizzo?: string;

  @IsOptional()
  @IsString()
  citta?: string;

  @IsOptional()
  @IsString()
  provincia?: string;

  @IsOptional()
  @IsString()
  cap?: string;

  @IsOptional()
  @IsString()
  paese?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsBoolean()
  attivo?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}