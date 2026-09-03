import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateHabitacionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  numero!: string;

  @IsInt()
  @Min(1)
  piso!: number;

  @IsInt()
  @Min(1)
  tipo_habitacion_id!: number;
}
