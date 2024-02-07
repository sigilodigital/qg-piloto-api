import { Test, TestingModule } from '@nestjs/testing';
import { CodigoVerificacaoController } from '../codigo-verificacao.controller';
import { CodigoVerificacaoService } from '../codigo-verificacao.service';

describe('CodigoVerificacaoController', () => {
  let controller: CodigoVerificacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CodigoVerificacaoController],
      providers: [CodigoVerificacaoService],
    }).compile();

    controller = module.get<CodigoVerificacaoController>(CodigoVerificacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
