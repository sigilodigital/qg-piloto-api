import { Test, TestingModule } from '@nestjs/testing';
import { CodigoVerificacaoService } from '../codigo-verificacao.service';

describe('CodigoVerificacaoService', () => {
  let service: CodigoVerificacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodigoVerificacaoService],
    }).compile();

    service = module.get<CodigoVerificacaoService>(CodigoVerificacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
