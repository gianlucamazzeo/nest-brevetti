import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsOptional, IsString, IsEmail, MinLength, Matches, IsEnum, IsBoolean } from 'class-validator';
import { CreateUtenteDto } from './create-utente.dto';

export class UpdateUtenteDto extends PartialType(
  OmitType(CreateUtenteDto, ['password'] as const)
) {
  @IsOptional()
  @IsEmail({}, { message: 'Email non valida' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Il nome deve essere una stringa' })
  nome?: string;

  @IsOptional()
  @IsString({ message: 'Il cognome deve essere una stringa' })
  cognome?: string;

  @IsOptional()
  @IsEnum(['ADMIN', 'UTENTE_STANDARD'], { message: 'Ruolo non valido' })
  ruolo?: string;

  @IsOptional()
  @IsBoolean({ message: 'Il campo attivo deve essere un booleano' })
  attivo?: boolean;
  password: any;
}

// DTO separato per l'aggiornamento della password
export class UpdatePasswordDto {
  @IsString({ message: 'La password deve essere una stringa' })
  @MinLength(8, { message: 'La password deve essere di almeno 8 caratteri' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'La password deve contenere almeno una lettera maiuscola, una minuscola e un numero o un carattere speciale',
  })
  currentPassword: string;

  @IsString({ message: 'La nuova password deve essere una stringa' })
  @MinLength(8, { message: 'La nuova password deve essere di almeno 8 caratteri' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'La nuova password deve contenere almeno una lettera maiuscola, una minuscola e un numero o un carattere speciale',
  })
  newPassword: string;
}