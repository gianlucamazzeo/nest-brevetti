import { PartialType } from '@nestjs/mapped-types';
import { CreateTitolareDto } from './create-titolare.dto';

export class UpdateTitolareDto extends PartialType(CreateTitolareDto) {}