import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from '../usuario.service';
import { UsuarioConsultarInputDto, UsuarioConsultarOutputDto } from '../models/dto/usuario-consultar.dto';
import { UsuarioRepository } from '../repositories/usuario-repository';
import { LoginUserInputDto } from 'src/auth/models/dto/login-user.dto';

describe('UsuarioService', () => {
    let service: UsuarioService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsuarioService, UsuarioRepository],
        }).compile();

        service = module.get<UsuarioService>(UsuarioService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('usuarioConsultar: deve retornar uma lista de usuários', async () => {
        const input: UsuarioConsultarInputDto = { isActive: true };
        const result = await service.usuarioConsultar(input);
        expect(result).toBeInstanceOf(Array<UsuarioConsultarOutputDto>);
    });

});
