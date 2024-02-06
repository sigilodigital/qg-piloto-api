import { Test, TestingModule } from '@nestjs/testing';

import { LoginUserInputDto } from 'src/auth/models/dto/login-user.dto';
import { UsuarioConsultarInputDto, UsuarioConsultarOutputDto } from '../models/dto/usuario-consultar.dto';
import { UsuarioEntity } from '../models/entities/usuario.entity';
import { UsuarioRepository } from '../repositories/usuario-repository';

describe('UsuarioRepository', () => {
    let repo: UsuarioRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsuarioRepository],
        }).compile();

        repo = module.get<UsuarioRepository>(UsuarioRepository);
    });

    it('should be defined', () => {
        expect(repo).toBeDefined();
    });

    it('usuarioRepository:usuarioFind: deve retornar uma lista de usuários ativos', async () => {
        const input: UsuarioConsultarInputDto = { isActive: true };
        const result = await repo.usuarioFind(input);

        expect(result).toBeInstanceOf(Array<UsuarioConsultarOutputDto>);
        expect(result.length).toBeGreaterThanOrEqual(2);
    });

    it('usuarioRepository:find: deve retornar uma lista de usuários', async () => {
        const input: LoginUserInputDto = { username: 'sd', password: '123' };
        const result = await repo.find({ where: { isActive: true } });

        expect(result).toBeInstanceOf(Array<UsuarioConsultarOutputDto>);
    });

    it('usuarioRepository:find: deve retornar todos os usuários, inclusive os dados das tabelas relacionadas', async () => {
        const input: UsuarioConsultarInputDto = {};
        const result = await repo.find({
            where: input, relations: {
                _contato: true,
                _dataAccess: true,
                _loginInfo: true
            }
        });

        expect(result).toBeInstanceOf(Array<UsuarioConsultarOutputDto>);
        expect(result.length).toBeGreaterThanOrEqual(2);
    });

    it('usuarioRepository:find: deve retornar apenas um usuário, mas com os dados das tabelas relacionadas', async () => {
        const input: UsuarioConsultarInputDto = { _dataAccess: { username: 'asdf', password: undefined } };
        const result: UsuarioEntity[] = await repo.find({
            where: input, relations: {
                _contato: true,
                _dataAccess: true,
                _loginInfo: true
            }
        });

        expect(result).toBeInstanceOf(Array<UsuarioConsultarOutputDto>);
        expect(result.length).toBeGreaterThanOrEqual(1);
        expect(result[0]._dataAccess).not.toBeNull();
        expect(result[0]._contato).not.toBeNull();
        expect(result[0]._loginInfo).toBeNull();
    });
});
