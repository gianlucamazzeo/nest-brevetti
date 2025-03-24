import { PartialType } from '@nestjs/mapped-types';
import { CreateBrevettoDto } from './create-brevetto.dto';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AddNotaDto {
  @IsString()
  @IsNotEmpty()
  testo: string;

  @IsString()
  @IsNotEmpty()
  autore: string;
}

class AddTimelineItemDto {
  @IsString()
  @IsNotEmpty()
  descrizione: string;
}

export class UpdateBrevettoDto extends PartialType(CreateBrevettoDto) {}

export class AddNotaBrevettoDto {
  @ValidateNested()
  @Type(() => AddNotaDto)
  nota: AddNotaDto;
}

export class AddTimelineItemBrevettoDto {
  @ValidateNested()
  @Type(() => AddTimelineItemDto)
  timelineItem: AddTimelineItemDto;
}