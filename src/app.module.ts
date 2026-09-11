import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AppConfigModule } from './config/config.module';
import { HabitacionModule } from './habitacion/habitacion.module';
import { TipoHabitacionModule } from './tipo-habitacion/tipo-habitacion.module';
import { HuespedModule } from './huesped/huesped.module';
import { EstadiaModule } from './estadia/estadia.module';
import { ConsumoModule } from './consumo/consumo.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    HabitacionModule,
    TipoHabitacionModule,
    HuespedModule,
    EstadiaModule,
    ConsumoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
