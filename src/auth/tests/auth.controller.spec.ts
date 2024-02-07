import { Test, TestingModule } from '@nestjs/testing';
import { Request as RequestExpress, Response as ResponseExpress } from 'express';

import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { LoginUserOutputDto } from '../models/dto/login-user.dto';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { UsuarioRepository } from 'src/usuario/repositories/usuario-repository';
import { ApiResponse } from '@libs/common/services/response-handler-v2';
import { JwtService } from '@nestjs/jwt';
import { UtilService } from '@libs/common/services/util.service';

describe('AuthController', () => {
    let controller: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            controllers: [AuthController],
            providers: [AuthService, ApiResponse, JwtService, UtilService, UsuarioRepository]
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should be defined', () => {
        controller.usuarioSenhaValidar;
    });
});

describe('AuthController - usuarioSenhaValidar', () => {
    let authController: AuthController;
    let authService: AuthService;
    let mockRequest: RequestExpress & { user: LoginUserOutputDto };
    let mockResponse: ResponseExpress;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        tokenUserGenerate: jest.fn().mockResolvedValue('mockToken'),
                    },
                }, ApiResponse, JwtService, UtilService, UsuarioRepository
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
        mockRequest = {
            // user: new LoginUserOutputDto()
            user: {}
        } as RequestExpress & { user: LoginUserOutputDto };
        mockResponse = {
            json: jest.fn(),
            header: jest.fn(),
        } as unknown as ResponseExpress;
    });

    it('should generate a token for the user and return the user data', async () => {
        await authController.usuarioSenhaValidar(mockRequest, mockResponse);
        expect(authService.tokenUserGenerate).toHaveBeenCalledWith(mockRequest.user);
        expect(mockResponse.header).toHaveBeenCalledWith('tokenUser', 'mockToken');
        expect(mockResponse.json).toHaveBeenCalled();
    });
});