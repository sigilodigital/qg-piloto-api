import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LoginCertController } from './login-cert.controller';
import { AuthCertService } from './login-cert.service';

@Module({
    imports: [HttpModule],
    controllers: [LoginCertController],
    providers: [AuthCertService]
})
export class LoginCertModule { }
