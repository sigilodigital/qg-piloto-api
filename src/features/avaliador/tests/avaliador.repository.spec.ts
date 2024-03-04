import { Test, TestingModule } from '@nestjs/testing';

import { SDExpectJest } from '@libs/common/tests/expects-jest';
import { LoginUserInputDto } from 'src/core/auth/models/dto/login-user.dto';
import { AvaliadorConsultarInputDto, AvaliadorConsultarOutputDto } from '../models/dto/avaliador-consultar/avaliador-consultar.dto';
import { DataAccessEntity } from '../models/entities/data-access.entity';
import { EmailEntity } from '../models/entities/email.entity';
import { AvaliadorEntity } from '../models/entities/avaliador.entity';
import { AvaliadorRepository } from '../repositories/avaliador.repository';
import { QUERY_RUNNER_PROVIDER } from '@sd-root/libs/common/src/providers/query-runner.provider';

describe('AvaliadorRepository', () => {
    let repo: AvaliadorRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AvaliadorRepository,
                QUERY_RUNNER_PROVIDER,
                // { provide: AvaliadorRepository, useFactory(...args) { return new AvaliadorRepository(); }, }
            ],
        }).compile();

        // repo = module.get<AvaliadorRepository>(AvaliadorRepository);
        repo = new AvaliadorRepository();
    });

    it('should be defined', () => {
        expect(repo).toBeDefined();
    });
});

describe('AvaliadorRepository: Testando conexão com DB', () => {
    let repo: AvaliadorRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [{
                provide: AvaliadorRepository, useFactory(...args) {
                    return new AvaliadorRepository();
                },
            }],
        }).compile();

        repo = module.get<AvaliadorRepository>(AvaliadorRepository);
    });

    it('should be defined', () => {
        expect(repo).toBeDefined();
    });

});

describe('AvaliadorRepository: testando os métodos do repository', () => {
    let userRepository: AvaliadorRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [{
                provide: AvaliadorRepository, useFactory(...args) {
                    return new AvaliadorRepository();
                },
            }],
        }).compile();

        userRepository = module.get<AvaliadorRepository>(AvaliadorRepository);
    });

    it('getUserList: deve retornar uma lista de avaliadores ativos', async () => {
        const input: AvaliadorConsultarInputDto = { isActive: true };
        try {
            const result = await userRepository.getUserList(input);

            expect(result).toBeInstanceOf(Array<AvaliadorConsultarOutputDto>);
            expect(result.length).toBeGreaterThanOrEqual(2);
        } catch (error) {
            await SDExpectJest.fnNotCatchError(error, expect);
        }
    });

    it('find: deve retornar uma lista de avaliadores', async () => {
        const input: LoginUserInputDto = { username: 'sd', password: '123' };
        const result = await userRepository.find({ where: { isActive: true } });

        expect(result).toBeInstanceOf(Array<AvaliadorConsultarOutputDto>);
    });

    it('find: deve retornar todos os avaliadores, inclusive os dados das tabelas relacionadas', async () => {
        const input: AvaliadorConsultarInputDto = {};
        const result = await userRepository.find({
            where: input, relations: {
                _contato: true,
                _dataAccess: true,
                _loginInfo: true
            }
        });

        expect(result).toBeInstanceOf(Array<AvaliadorConsultarOutputDto>);
        expect(result.length).toBeGreaterThanOrEqual(2);
        expect(result[0]).toMatchObject({
            'id': expect.any(String),
            // '_dataAccess': expect.any(DataAccessEntity),
            '_contato': { '_emailList': expect.any(Array<EmailEntity>) },
            // '_profileList': expect.any(Array<ProfileEntity>),
        });
    });

    it('findOne: deve retornar apenas um avaliador e seus relacionamentos', async () => {
        const input: AvaliadorConsultarInputDto = { _dataAccess: { username: 'abcd' } };
        const result = await userRepository.findOne({
            where: input, relations: {
                _contato: true,
                _dataAccess: true,
                _loginInfo: true
            }
        });

        expect(result).toBeInstanceOf(AvaliadorEntity);
        expect(result).toMatchObject({
            'id': expect.any(String),
            '_dataAccess': expect.any(DataAccessEntity),
            '_contato': { '_emailList': expect.any(Array<EmailEntity>) },
            // '_profileList': expect.any(Array<ProfileEntity>),
        });
    });
});
