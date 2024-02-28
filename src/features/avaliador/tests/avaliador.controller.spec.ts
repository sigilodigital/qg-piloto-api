import { Test, TestingModule } from '@nestjs/testing';
import { AvaliadorController } from '../avaliador.controller';
import { AvaliadorService } from '../avaliador.service';

describe('AvaliadorController', () => {
  let controller: AvaliadorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvaliadorController],
      providers: [AvaliadorService],
    }).compile();

    controller = module.get<AvaliadorController>(AvaliadorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
