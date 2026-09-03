import { Test, TestingModule } from '@nestjs/testing';
import { TipoHabitacionService } from './tipo-habitacion.service';

describe('TipoHabitacionService', () => {
  let service: TipoHabitacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoHabitacionService],
    }).compile();

    service = module.get<TipoHabitacionService>(TipoHabitacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
