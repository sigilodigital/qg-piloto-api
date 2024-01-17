import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioExternoService } from './usuario-externo.service';

describe('UsuarioExternoService', () => {
  let service: UsuarioExternoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuarioExternoService],
    }).compile();

    service = module.get<UsuarioExternoService>(UsuarioExternoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
