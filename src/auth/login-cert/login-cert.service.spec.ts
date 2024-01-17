import { Test, TestingModule } from '@nestjs/testing';
import { AuthCertService } from './login-cert.service';

describe('LoginCertService', () => {
    let service: AuthCertService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthCertService],
        }).compile();

        service = module.get<AuthCertService>(AuthCertService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
