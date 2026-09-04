import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateHuespedDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellido!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  documento!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  correo?: string;
}
