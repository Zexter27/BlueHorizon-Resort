import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min,} from 'class-validator';

export class CreateConsumoDto {
  @IsInt()
  @Min(1)
  estadia_id!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  descripcion!: string;

  @IsNumber()
  @Min(0.01)
  precio!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  cantidad?: number;

  @IsOptional()
  @IsDateString()
  fecha?: string;
}