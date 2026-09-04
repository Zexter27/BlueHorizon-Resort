import { IsDateString, IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateEstadiaDto {
  @IsInt()
  @Min(1)
  huesped_id!: number;

  @IsInt()
  @Min(1)
  habitacion_id!: number;

  @IsDateString()
  @IsNotEmpty()
  fecha_entrada!: string;

  @IsDateString()
  @IsNotEmpty()
  fecha_salida!: string;
}
