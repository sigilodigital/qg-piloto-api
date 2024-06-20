import { ApiResponse } from '@libs/common/services/api-response';
import { UtilService } from '@libs/common/services/util.service';
import { SDExpectJest } from '@libs/common/tests/expects-jest';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UtilRepository } from '@sd-root/libs/common/src/repository/util.repository';
import { UsuarioRepository } from '@sd-root/src/features/usuario/repositories/usuario.repository';
import { UsuarioEntity } from 'src/features/usuario/models/entities/usuario.entity';
import { AuthService } from '../auth.service';
import { LoginUserInputDto } from '../models/dto/login-user.dto';

describe('AuthService :: MockData', () => {

    let authService: AuthService;
    let userRepository: UsuarioRepository;
    let utilService: UtilService;
    let user: UsuarioEntity;
    let input: LoginUserInputDto;

    beforeEach(async () => {

        user = {
            id: 'a1b2c3d4',
            cpf: 12345678901,
            fullname: 'Mock fullname',
            socialname: 'Mock SocialName',
            isActive: true,
            _dataAccess: {
                username: 'abcd',
                password: '$2a$10$sU8WdC5ggk02VlMTJ41lWuXx/dUpaKywTMRLg7sDJ/qO0MGTAmDD.', //? abcd1234
                passCountErrors: 0,
                isPasswordRequireChange: false,
            }
        };

        input = { username: 'abcd', password: 'abcd1234' };

        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
                AuthService, ApiResponse, JwtService, UtilService,
                { provide: UtilRepository, useFactory(...args) { return new UtilRepository(); } },
                { provide: UsuarioRepository, useFactory(...args) { return new UsuarioRepository(); } },
                // {provide:UsuarioRepository, useValue: {
                //     findOne: jest.fn().mockResolvedValue(user),
                //     update: jest.fn().mockResolvedValue(user),
                // }}
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userRepository = module.get<UsuarioRepository>(UsuarioRepository);
        utilService = module.get<UtilService>(UtilService);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
        expect(userRepository).toBeDefined();
        expect(utilService).toBeDefined();
    });

    jest.setTimeout(60000)
    it('SUCESSO: deve retornar os dados de login necessários', async () => {

        // const input: LoginUserInputDto = {username: 'abcd', password:'abcd1234'}
        // jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
        // jest.spyOn(userRepository, 'init').mockResolvedValue(<QueryRunner>{});
        // jest.spyOn(userRepository, 'update').mockResolvedValueOnce(user);
        // jest.spyOn(utilService, 'decrypt').mockResolvedValueOnce(true);

        try {
            const result = await authService.usuarioValidar(input);

            expect(result).toMatchObject({
                'id': expect.any(String),
                'fullname': expect.any(String),
                'socialname': expect.any(String),
                'cpf': expect.any(String),
                '__params': {
                    'isPasswordRequireChange': expect.any(Boolean)
                }
            });
        } catch (error) {
            await SDExpectJest.fnNotCatchError(error, expect);
        }
    });

    it('FALHA: propriedade senha não registrado no BD.', async () => {

        // const input: LoginUserInputDto = {username: 'abcd', password:'abcd1234'}

        jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce({ ...user, _dataAccess: { password: undefined } } as UsuarioEntity);
        // jest.spyOn(userRepository, 'update').mockResolvedValueOnce(user);
        // jest.spyOn(utilService, 'decrypt').mockResolvedValueOnce(true);

        // expect.assertions(1)
        try {
            expect(await authService.usuarioValidar(input)).toThrow();
            // await expect(authService.usuarioValidar(input)).rejects.toThrow();
            // const result = await authService.usuarioValidar(input)
            // expect(result).toThrow()
        } catch (error) {

            await SDExpectJest.fnCatchErrorDefault(error, expect);
        }
    });
});
