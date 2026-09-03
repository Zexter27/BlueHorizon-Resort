import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consumo } from './entities/consumo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consumo]),
  ],
})
export class ConsumoModule {}
