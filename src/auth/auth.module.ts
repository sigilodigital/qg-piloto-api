import { CommonModule } from '@libs/common';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from 'src/config/constants';
import { InteressadoEntity } from 'src/interessado/entities/interessado.entity';
import { InteressadoService } from 'src/interessado/interessado.service';
import { SistemaMensagemFila } from 'src/sistema-mensagem-fila/entities/sistema-mensagem-fila.entity';
import { SistemaMensagemFilaService } from 'src/sistema-mensagem-fila/sistema-mensagem-fila.service';
import { UsuarioExternoService } from 'src/usuario-externo/usuario-externo.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { LoginCertModule } from './login-cert/login-cert.module';
import { LoginModule } from './login/login.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoginSistemaStrategy } from './strategies/login-sistema.strategy';
import { LoginUserStrategy } from './strategies/login-user.strategy';

@Module({
    imports: [
        InteressadoEntity,
        UserDto,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '24h', }
        }),
        LoginModule,
        LoginCertModule,
        
        CommonModule
    ],
    providers: [
        AuthService,
        LoginSistemaStrategy,
        LoginUserStrategy,
        InteressadoService,
        UsuarioExternoService,
        SistemaMensagemFila,
        SistemaMensagemFilaService,
        JwtStrategy
    ],
    controllers: [AuthController]
})
export class AuthModule { }