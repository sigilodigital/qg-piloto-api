import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { NextFunction } from 'express';
import { PkiService } from './services/pki.service';
import { LoginCertCompleteUseCase as AuthCertCompleteUseCase } from './usecases/login-cert-verificar/login-cert-complete.usecase';
import { LoginCertStartUseCase as AuthCertStartUseCase } from './usecases/login-cert-verificar/login-cert-start.usecase';
import { AuthCertLoginUseCase } from './usecases/login-cert-verificar/login-cert-authenticate.usecase';
// import { AuthRepository } from '../repository/auth-repository';
import { CertificadoUsuarioExternoVerificarUseCase } from './usecases/login-cert-verificar/certificado-usuario-externo-verificar.usecase';
import { UtilRepository } from '@libs/common/repository/util.repository';

@Injectable()
export class AuthCertService {

    async authenticationStart(next: NextFunction) {
        const ucAuthCert = new AuthCertStartUseCase(new PkiService(new HttpService));
        const result = await ucAuthCert.handle(next);
        return result;
    }

    async authenticationComplete(body: { token: string; }) {
        const ucAuthCert = new AuthCertCompleteUseCase(new PkiService(new HttpService));
        const result = await ucAuthCert.handle(body);
        return result;
    }

    async authenticationLogin(txtCnpjCpf: string) {
        const ucAuthCert = new AuthCertLoginUseCase(new UtilRepository()); //!MODIFICADO
        const result = await ucAuthCert.handle(txtCnpjCpf);
        return result;
    }

    async certificadoUsuarioExternoVerificar(txtCnpjCpf: string) {
        const ucAuthCert = new CertificadoUsuarioExternoVerificarUseCase(new UtilRepository()); //!MODIFICADO
        const result = await ucAuthCert.handle(txtCnpjCpf);
        return result;
    }

}
