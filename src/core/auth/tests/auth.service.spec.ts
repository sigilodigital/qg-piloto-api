import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { UtilService } from '@libs/common/services/util.service';
import { UsuarioRepository } from '@sd-root/src/features/usuario/repositories/usuario-repository';
import { UsuarioModule } from '@sd-root/src/features/usuario/usuario.module';
import { ApiResponse } from '@sd-root/libs/common/src/services/response-handler';
import { LoginUserInputDto, LoginUserOutputDto } from '../models/dto/login-user.dto';
import { UsuarioEntity } from '@sd-root/src/features/usuario/models/entities/usuario.entity';
import { BadRequestException, HttpException } from '@nestjs/common/exceptions';
import { MSG } from '@sd-root/libs/common/src/services/code-messages';
import { SDExpectJest } from '@sd-root/libs/common/src/tests/expects-jest';

describe('AuthService', () => {

    let authService: AuthService;
    let userRepository: UsuarioRepository;
    let utilService: UtilService
    let user: UsuarioEntity
    let input: LoginUserInputDto

    beforeEach(async () => {
        
        user = {
            id: 'a1b2c3d4',
            cpf: 12345678901,
            fullname: 'Mock fullname',
            socialname: 'Mock SocialName',
            isActive: true,
            _dataAccess:{ 
                username: 'abcd', 
                password: '$2a$10$sU8WdC5ggk02VlMTJ41lWuXx/dUpaKywTMRLg7sDJ/qO0MGTAmDD.', //? abcd1234
                passCountErrors: 0, 
                isPasswordRequireChange: false,
            }
        }
        
        input = {username: 'abcd', password:'abcd1234'}

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService, ApiResponse, JwtService, UtilService, UsuarioRepository,
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

    it('SUCESSO: deve retornar os dados de login necessários', async () => {

        const input: LoginUserInputDto = {username: 'abcd', password:'abcd1234'}
        
        jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(user);
        jest.spyOn(userRepository, 'update').mockResolvedValueOnce(user);
        // jest.spyOn(utilService, 'decrypt').mockResolvedValueOnce(true);

        try {
            const result = await authService.usuarioValidar(input)

            expect(result).toMatchObject({
                'id': expect.any(String), 
                'fullname': expect.any(String), 
                'socialname': expect.any(String), 
                'cpf': expect.any(Number),
                '__params': {
                    'isPasswordRequireChange': expect.any(Boolean)
                }
            });
        } catch(error){
            await SDExpectJest.fnNotCatchError(error, expect)
        }
    });

    it('FALHA: propriedade senha não registrado no BD.', async () => {

        const input: LoginUserInputDto = {username: 'abcd', password:'abcd1234'}
        
        jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce({...user, _dataAccess:{ password: undefined } } as UsuarioEntity);
        jest.spyOn(userRepository, 'update').mockResolvedValueOnce(user);
        // jest.spyOn(utilService, 'decrypt').mockResolvedValueOnce(true);

        const r = {ERR_: (()=>{return 'asdf'})(), SUCCESS: (()=>{return 'asdf2'})() }
        
        const S = Object.keys(r)
        console.log(r)
        console.log(r.ERR_)
        console.log(S)
        // expect.assertions(1)
        try {
            const result = await authService.usuarioValidar(input)
            expect(result).toThrow()
        } catch (error){
            await SDExpectJest.fnCatchErrorDefault(error, expect)
        }
    });
});

// async function fnNotCatchError(error) {
//     expect(error).not.toBeInstanceOf(Error);
//     expect(error).not.toBeInstanceOf(HttpException);
// }

// async function fnCatchErrorDefault(error) {
//     expect(error).toBeInstanceOf(Error);
//     expect(error).toBeInstanceOf(HttpException);
//     expect(error).toBeInstanceOf(BadRequestException);
// }

// async function fnCatchErrorForRequired(error) {
//     expect(error.response).toHaveProperty('status.statusCode', MSG.ERR_FIELD_N_INFO.code);
// }

// async function fnCatchErrorForSize(error) {
//     expect(error.response).toHaveProperty('status.statusCode', MSG.ERR_FIELD_TAM);
// }

// async function fnCatchErrorForType(error) {
//     expect(error.response).toHaveProperty('status.statusCode', MSG.ERR_FIELD_TIPO);
// }

// async function fnCatchErrorForValue(error) {
//     expect(error.response).toHaveProperty('status.statusCode', MSG.ERR_FIELD_VALOR);
// }

// describe('AuthService', () => {
//     let authService: AuthService;
//     let mockJwtService: JwtService;
//     let mockUtilService: UtilService;
//     let mockUtilRepository: UtilRepository;
//     // Add any other dependencies that are required by AuthService

//     beforeEach(async () => {
//       // Create mocks for each of the dependencies
//       mockJwtService = createMockInstance(JwtService);
//       mockUtilService = createMockInstance(UtilService);
//       mockUtilRepository = createMockInstance(UtilRepository);
//       // Initialize AuthService with the mocked dependencies
//       authService = new AuthService(mockJwtService, mockUtilService, mockUtilRepository);
//     });

//     describe('sistemaValidar', () => {
//       it('should validate the system and return a valid output', async () => {
//         const input: LoginSistemaInputDto = {
//           // Populate with necessary input fields
//         };
//         const expectedOutput: LoginSistemaOutputDto = {
//           // Populate with expected output fields
//         };

//         // Mock the utilRepository.findOne method to return a valid system entity
//         jest.spyOn(mockUtilRepository, 'findOne').mockResolvedValue(/* Mocked SistemaEntity */);

//         // Call the sistemaValidar method
//         const result = await authService.sistemaValidar(input);

//         // Assertions to ensure the method behaves as expected
//         expect(result).toEqual(expectedOutput);
//         expect(mockUtilRepository.findOne).toHaveBeenCalledWith(SistemaEntity, expect.any(Object));
//         // Add any other assertions that make sense for your test case
//       });
      
//       it('should throw an error if the system is not found', async () => {
//         const input: LoginSistemaInputDto = {
//           // Populate with necessary input fields
//         };

//         // Mock the utilRepository.findOne method to return null, simulating not found
//         jest.spyOn(mockUtilRepository, 'findOne').mockResolvedValue(null);

//         // Expect the sistemaValidar method to throw an error when the system is not found
//         await expect(authService.sistemaValidar(input)).rejects.toThrow();
//       });

//       // Add more test cases as necessary
//     });

//     // Additional tests for other AuthService methods can go here
//   });

// describe('AuthService', () => {
//     let authService: AuthService;
    
//     beforeEach(async () => {
//       const module: TestingModule = await Test.createTestingModule({
//         providers: [AuthService],
//       }).compile();

//       authService = module.get<AuthService>(AuthService);
//     });

//     describe('usuarioValidar', () => {
//       it('should return a LoginUserOutputDto when valid input is provided', async () => {
//         const input: LoginUserInputDto = {
//           username: 'testUser',
//           password: 'testPass'
//         };
//         const user: UsuarioEntity = new UsuarioEntity();
//         user._dataAccess = { username: 'testUser', password: 'hashedPassword' };

//         jest.spyOn(authService, 'usuarioRepo.findOne').mockResolvedValue(user);
//         jest.spyOn(authService, 'throwSeUsuarioAusente').mockResolvedValue(undefined);
//         jest.spyOn(authService, 'throwSeUsuarioInativo').mockResolvedValue(undefined);
//         jest.spyOn(authService, 'throwSeUsuarioSenhaNaoCadastrada').mockResolvedValue(undefined);
//         jest.spyOn(authService, 'throwSeUsuarioSenhaBloqueada').mockResolvedValue(undefined);
//         jest.spyOn(authService, 'fnUsuarioSenhaConferir').mockResolvedValue(undefined);

//         const result = await authService.usuarioValidar(input);
//         expect(result).toBeInstanceOf(LoginUserOutputDto);
//       });
//     });
//   });