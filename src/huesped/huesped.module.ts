import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Huesped } from './entities/huesped.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Huesped]),
  ],
})
export class HuespedModule {}
