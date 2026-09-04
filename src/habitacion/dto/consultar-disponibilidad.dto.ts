import { IsDateString, IsNotEmpty } from 'class-validator';

export class ConsultarDisponibilidadDto {
  @IsDateString()
  @IsNotEmpty()
  fecha_entrada!: string;

  @IsDateString()
  @IsNotEmpty()
  fecha_salida!: string;
}