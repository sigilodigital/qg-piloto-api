import { Test, TestingModule } from '@nestjs/testing';
import { SistemaWsController } from './sistema-ws.controller';
import { SistemaWsService } from './sistema-ws.service';

describe('SistemaWsController', () => {
  let controller: SistemaWsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SistemaWsController],
      providers: [SistemaWsService],
    }).compile();

    controller = module.get<SistemaWsController>(SistemaWsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
