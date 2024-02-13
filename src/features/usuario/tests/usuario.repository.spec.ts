import { Test, TestingModule } from '@nestjs/testing';

import { SDExpectJest } from '@libs/common/tests/expects-jest';
import { LoginUserInputDto } from 'src/core/auth/models/dto/login-user.dto';
import { UsuarioConsultarInputDto, UsuarioConsultarOutputDto } from '../models/dto/usuario-consultar.dto';
import { DataAccessEntity } from '../models/entities/data-access.entity';
import { EmailEntity } from '../models/entities/email.entity';
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
});

describe('UsuarioRepository: Testando conexão com DB', () => {
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

});

describe('UsuarioRepository: testando os métodos do repository', () => {
    let userRepository: UsuarioRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsuarioRepository],
        }).compile();

        userRepository = module.get<UsuarioRepository>(UsuarioRepository);
    });

    it('getUserList: deve retornar uma lista de usuários ativos', async () => {
        const input: UsuarioConsultarInputDto = { isActive: true };
        try {
            const result = await userRepository.getUserList(input);

            expect(result).toBeInstanceOf(Array<UsuarioConsultarOutputDto>);
            expect(result.length).toBeGreaterThanOrEqual(2);
        } catch (error) {
            await SDExpectJest.fnNotCatchError(error, expect);
        }
    });

    it('find: deve retornar uma lista de usuários', async () => {
        const input: LoginUserInputDto = { username: 'sd', password: '123' };
        const result = await userRepository.find({ where: { isActive: true } });

        expect(result).toBeInstanceOf(Array<UsuarioConsultarOutputDto>);
    });

    it('find: deve retornar todos os usuários, inclusive os dados das tabelas relacionadas', async () => {
        const input: UsuarioConsultarInputDto = {};
        const result = await userRepository.find({
            where: input, relations: {
                _contato: true,
                _dataAccess: true,
                _loginInfo: true
            }
        });

        expect(result).toBeInstanceOf(Array<UsuarioConsultarOutputDto>);
        expect(result.length).toBeGreaterThanOrEqual(2);
        expect(result[0]).toMatchObject({
            'id': expect.any(String),
            // '_dataAccess': expect.any(DataAccessEntity),
            '_contato': { '_emailList': expect.any(Array<EmailEntity>) },
            // '_profileList': expect.any(Array<ProfileEntity>),
        });
    });

    it('findOne: deve retornar apenas um usuário e seus relacionamentos', async () => {
        const input: UsuarioConsultarInputDto = { _dataAccess: { username: 'abcd' } };
        const result = await userRepository.findOne({
            where: input, relations: {
                _contato: true,
                _dataAccess: true,
                _loginInfo: true
            }
        });

        expect(result).toBeInstanceOf(UsuarioEntity);
        expect(result).toMatchObject({
            'id': expect.any(String),
            '_dataAccess': expect.any(DataAccessEntity),
            '_contato': { '_emailList': expect.any(Array<EmailEntity>) },
            // '_profileList': expect.any(Array<ProfileEntity>),
        });
    });
});
