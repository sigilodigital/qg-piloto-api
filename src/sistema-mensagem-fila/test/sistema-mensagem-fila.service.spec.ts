import { Test, TestingModule } from '@nestjs/testing';
import { SistemaMensagemFilaService } from '../sistema-mensagem-fila.service';

describe('SistemaMensagemFilaService', () => {
  let service: SistemaMensagemFilaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SistemaMensagemFilaService],
    }).compile();

    service = module.get<SistemaMensagemFilaService>(SistemaMensagemFilaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
