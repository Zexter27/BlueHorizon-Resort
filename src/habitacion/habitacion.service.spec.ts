import { Test, TestingModule } from '@nestjs/testing';
import { HabitacionService } from './habitacion.service';

describe('HabitacionService', () => {
  let service: HabitacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HabitacionService],
    }).compile();

    service = module.get<HabitacionService>(HabitacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
