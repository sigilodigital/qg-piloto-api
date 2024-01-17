import { Test, TestingModule } from '@nestjs/testing';
import { SistemaMensagemFilaController } from './sistema-mensagem-fila.controller';
import { SistemaMensagemFilaService } from './sistema-mensagem-fila.service';

describe('SistemaMensagemFilaController', () => {
  let controller: SistemaMensagemFilaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SistemaMensagemFilaController],
      providers: [SistemaMensagemFilaService],
    }).compile();

    controller = module.get<SistemaMensagemFilaController>(SistemaMensagemFilaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
