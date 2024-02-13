import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { CommonModule } from '@libs/common';
import configs from '@libs/common/configs';
import { UsuarioModule } from '@sd-root/src/features/usuario/usuario.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginCertModule } from './login-cert/login-cert.module';
import { LoginModule } from './login/login.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { LoginSistemaStrategy } from './strategies/login-system.strategy';
import { LoginUserStrategy } from './strategies/login-user.strategy';

@Module({
    imports: [
        UsuarioModule,
        PassportModule,
        JwtModule.register({
            secret: configs().auth.secretKey,
            signOptions: { expiresIn: configs().auth.expiresIn.bearer }
        }),
        LoginModule,
        LoginCertModule,

        CommonModule
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,

        //TODO: conferir estas dependências abaixo
        LoginSistemaStrategy,
        LoginUserStrategy,
        JwtStrategy
    ]
})
export class AuthModule { }
