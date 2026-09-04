import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estadia } from './entities/estadia.entity';
import { Huesped } from '../huesped/entities/huesped.entity';
import { Habitacion } from '../habitacion/entities/habitacion.entity';
import { EstadiaController } from './estadia.controller';
import { EstadiaService } from './estadia.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Estadia,
      Huesped,
      Habitacion,
    ]),
  ],
  controllers: [
    EstadiaController,
  ],
  providers: [
    EstadiaService,
  ],
})
export class EstadiaModule {}
