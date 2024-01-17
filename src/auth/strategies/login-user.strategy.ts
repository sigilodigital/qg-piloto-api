import { Injectable, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { LoginUser } from '../dto/loginUser.dto';
import { ApiResponse } from '@libs/common/services/response-handler';

@Injectable()
export class LoginUserStrategy extends PassportStrategy(Strategy, "login-user-strategy") {
    constructor(private readonly authService: AuthService) {
        super({ usernameField: 'txtCnpjCpf', passwordField: 'txtSenha' });
    }

    async validate(username: string, password: string): Promise<any> {

        const loginUser: LoginUser = { txtCnpjCpf: username, txtSenha: password };

        const user = await this.authService.validarUsuario(loginUser);

        return user;
    }
}
