import { PartialType } from '@nestjs/mapped-types';
import { CreateEstadiaDto } from './create-estadia.dto';

export class UpdateEstadiaDto extends PartialType(CreateEstadiaDto) {}
