import { Test, TestingModule } from '@nestjs/testing';
import { TipoHabitacionController } from './tipo-habitacion.controller';
import { TipoHabitacionService } from './tipo-habitacion.service';

describe('TipoHabitacionController', () => {
  let controller: TipoHabitacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoHabitacionController],
      providers: [TipoHabitacionService],
    }).compile();

    controller = module.get<TipoHabitacionController>(TipoHabitacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
