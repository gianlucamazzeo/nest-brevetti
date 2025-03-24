import { IsArray, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { StatoBrevetto } from '../enums/stato-brevetto.enum';

class TimelineItemDto {
  @IsDate()
  @Type(() => Date)
  data: Date;

  @IsString()
  @IsNotEmpty()
  descrizione: string;
}

class NotaDto {
  @IsString()
  @IsNotEmpty()
  testo: string;

  @IsString()
  @IsNotEmpty()
  autore: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  data?: Date;
}

export class CreateBrevettoDto {
  @IsString()
  @IsNotEmpty()
  numero: string;

  @IsString()
  @IsNotEmpty()
  titolo: string;

  @IsString()
  @IsNotEmpty()
  descrizione: string;

  @IsEnum(StatoBrevetto)
  stato: StatoBrevetto;

  @IsDate()
  @Type(() => Date)
  dataDeposito: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dataConcessione?: Date;

  @IsDate()
  @Type(() => Date)
  dataScadenza: Date;

  @IsArray()
  @IsString({ each: true })
  titolari: string[];

  @IsArray()
  @IsString({ each: true })
  inventori: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  classificazioneIPC?: string[];

  @IsOptional()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimelineItemDto)
  timeline?: TimelineItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NotaDto)
  note?: NotaDto[];
}