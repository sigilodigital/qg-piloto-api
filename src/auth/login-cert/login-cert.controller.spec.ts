import { Test, TestingModule } from '@nestjs/testing';
import { LoginCertController } from './login-cert.controller';
import { AuthCertService } from './login-cert.service';

describe('LoginCertController', () => {
    let controller: LoginCertController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LoginCertController],
            providers: [AuthCertService],
        }).compile();

        controller = module.get<LoginCertController>(LoginCertController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
