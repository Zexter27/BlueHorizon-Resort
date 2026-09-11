import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoHabitacion } from './entities/tipo-habitacion.entity';
import { TipoHabitacionController } from './tipo-habitacion.controller';
import { TipoHabitacionService } from './tipo-habitacion.service';
import { Habitacion } from '../habitacion/entities/habitacion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TipoHabitacion,
      Habitacion,
    ]),
  ],
  controllers: [TipoHabitacionController],
  providers: [TipoHabitacionService],
  exports: [TipoHabitacionService],
})
export class TipoHabitacionModule {}
