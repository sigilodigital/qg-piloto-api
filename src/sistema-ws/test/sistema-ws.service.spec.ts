import { Test, TestingModule } from '@nestjs/testing';
import { SistemaWsService } from '../sistema-ws.service';

describe('SistemaWsService', () => {
  let service: SistemaWsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SistemaWsService],
    }).compile();

    service = module.get<SistemaWsService>(SistemaWsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
