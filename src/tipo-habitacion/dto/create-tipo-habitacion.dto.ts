import {IsNotEmpty, IsNumber, IsString, MaxLength, Min,} from 'class-validator';

export class CreateTipoHabitacionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre!: string;

  @IsNumber()
  @Min(0.01)
  precio_noche!: number;
}