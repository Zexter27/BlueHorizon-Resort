import { Test, TestingModule } from '@nestjs/testing';
import { HabitacionController } from './habitacion.controller';
import { HabitacionService } from './habitacion.service';

describe('HabitacionController', () => {
  let controller: HabitacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HabitacionController],
      providers: [HabitacionService],
    }).compile();

    controller = module.get<HabitacionController>(HabitacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
