import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consumo } from './entities/consumo.entity';
import { Estadia } from '../estadia/entities/estadia.entity';
import { ConsumoController } from './consumo.controller';
import { ConsumoService } from './consumo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consumo, Estadia]),
  ],
  controllers: [
    ConsumoController,
  ],
  providers: [
    ConsumoService,
  ],
})
export class ConsumoModule {}
