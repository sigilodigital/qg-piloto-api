import { Test, TestingModule } from '@nestjs/testing';
import { InteressadoService } from './interessado.service';

describe('InteressadoService', () => {
  let service: InteressadoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InteressadoService],
    }).compile();

    service = module.get<InteressadoService>(InteressadoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
