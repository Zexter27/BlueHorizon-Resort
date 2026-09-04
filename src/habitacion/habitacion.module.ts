import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habitacion } from './entities/habitacion.entity';
import { HabitacionController } from './habitacion.controller';
import { HabitacionService } from './habitacion.service';
import { TipoHabitacion } from '../tipo-habitacion/entities/tipo-habitacion.entity';
import { Estadia } from '../estadia/entities/estadia.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Habitacion,
      TipoHabitacion,
      Estadia,
    ]),
  ],

  controllers: [
    HabitacionController,
  ],

  providers: [
    HabitacionService,
  ],

  exports: [
    HabitacionService,
  ],
})
export class HabitacionModule {}