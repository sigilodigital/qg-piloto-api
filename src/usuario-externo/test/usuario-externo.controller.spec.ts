import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioExternoController } from '../usuario-externo.controller';
import { UsuarioExternoService } from '../usuario-externo.service';

describe('UsuarioExternoController', () => {
  let controller: UsuarioExternoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioExternoController],
      providers: [UsuarioExternoService],
    }).compile();

    controller = module.get<UsuarioExternoController>(UsuarioExternoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
