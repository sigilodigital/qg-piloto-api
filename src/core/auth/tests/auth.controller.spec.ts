import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Request as RequestExpress, Response as ResponseExpress } from 'express';

import { UtilService } from '@libs/common/services/util.service';
import { ApiResponse } from '@libs/common/services/api-response';
import { UsuarioRepository } from '@sd-root/src/features/usuario/repositories/usuario.repository';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { LoginUserOutputDto } from '../models/dto/login-user.dto';
import { UtilRepository } from '@sd-root/libs/common/src';
import { QUERY_RUNNER_PROVIDER } from '@sd-root/libs/common/src/providers/query-runner.provider';

describe('AuthController :: MockData', () => {
    let controller: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthService, ApiResponse, JwtService, UtilService,
                QUERY_RUNNER_PROVIDER, UtilRepository, UsuarioRepository
                // { provide: UtilRepository, useFactory(...args) { return new UtilRepository(); }, },
                // { provide: UsuarioRepository, useFactory(...args) { return new UsuarioRepository(); }, }
            ]
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should be defined', () => {
        controller.usuarioAutenticar;
    });
});

describe('AuthController - usuarioAutenticar', () => {
    let authController: AuthController;
    let authService: AuthService;
    let mockRequest: RequestExpress & { user: LoginUserOutputDto; };
    let mockResponse: ResponseExpress;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                { provide: AuthService, useValue: { tokenGenerate: jest.fn().mockResolvedValue('mockToken') } },
                ApiResponse
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
        mockRequest = {
            user: {
                id: 'a1b2c3d4',
                cpf: 12345678901,
                fullname: 'Mock fullname',
                socialname: 'Mock SocialName',
                __params: { isPasswordRequireChange: false }
            }
        } as RequestExpress & { user: LoginUserOutputDto; };
        mockResponse = { json: jest.fn(), header: jest.fn(), } as unknown as ResponseExpress;
    });

    it('should generate a token for the user and return the user data', async () => {
        const result = await authController.usuarioAutenticar(mockRequest, mockResponse);
        const s = mockResponse.json();
        // expect(authService.tokenGenerate).toHaveBeenCalledWith(mockRequest.user);
        expect(authService.tokenGenerate).toHaveBeenCalledTimes(2);
        expect(mockResponse.header).toHaveBeenCalledWith('token-bearer', 'mockToken');
        expect(mockResponse.header).toHaveBeenCalledWith('token-replace', 'mockToken');
        expect(mockResponse.json).toHaveBeenCalled();
    });
});

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;
    let mockResponse: ResponseExpress;
    let mockRequest: RequestExpress & { user: LoginUserOutputDto; };

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthService, ApiResponse],
        })
            .overrideProvider(AuthService)
            .useValue({ tokenGenerate: jest.fn().mockResolvedValue('mockToken') })
            .compile();

        authService = moduleRef.get<AuthService>(AuthService);
        authController = moduleRef.get<AuthController>(AuthController);

        mockResponse = createResponseMock();
        mockRequest = createRequestMock();
    });

    it('should validate user and generate tokens', async () => {
        const userOutputDto: LoginUserOutputDto = {
            id: 'a1b2c3d4',
            cpf: 12345678901,
            fullname: 'Mock fullname',
            socialname: 'Mock SocialName',
            __params: { isPasswordRequireChange: true }
        };
        const expectedTokenResult = {
            bearer: 'bearer-token',
            replace: 'replace-token',
        };

        jest.spyOn(authService, 'tokenGenerate').mockResolvedValueOnce('bearer-token').mockResolvedValueOnce('replace-token');
        mockRequest.user = userOutputDto;

        const result = await authController.usuarioAutenticar(mockRequest, mockResponse);

        expect(authService.tokenGenerate).toHaveBeenCalledTimes(2);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.any(Object));
        // expect(result).toEqual(expect.any(Object));
    });

    function createRequestMock(): RequestExpress & { user: LoginUserOutputDto; } {
        return { user: {} } as RequestExpress & { user: LoginUserOutputDto; };
    }

    function createResponseMock(): ResponseExpress {
        return { json: jest.fn(), header: jest.fn() } as unknown as ResponseExpress;
    }
});