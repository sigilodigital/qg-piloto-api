import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { UtilService } from '@libs/common/services/util.service';
import { UsuarioRepository } from 'src/usuario/repositories/usuario-repository';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { ApiResponse } from '@libs/common/services/response-handler-v2';

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService, ApiResponse, JwtService, UtilService, UsuarioRepository],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

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