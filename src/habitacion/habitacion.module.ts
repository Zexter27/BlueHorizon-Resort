import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Habitacion } from './entities/habitacion.entity';
import { HabitacionController } from './habitacion.controller';
import { HabitacionService } from './habitacion.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Habitacion,
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