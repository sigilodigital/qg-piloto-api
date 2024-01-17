import { Test, TestingModule } from '@nestjs/testing';
import { InteressadoController } from '../interessado.controller';
import { InteressadoService } from '../interessado.service';

describe('InteressadoController', () => {
  let controller: InteressadoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InteressadoController],
      providers: [InteressadoService],
    }).compile();

    controller = module.get<InteressadoController>(InteressadoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
