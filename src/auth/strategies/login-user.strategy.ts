import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { LoginUserInputDto } from '../models/dto/login-user.dto';

@Injectable()
export class LoginUserStrategy extends PassportStrategy(Strategy, "login-user-strategy") {
    constructor(private readonly authService: AuthService) {
        super({ usernameField: 'username', passwordField: 'password' });
    }

    async validate(username: string, password: string): Promise<any> {

        const loginUser: LoginUserInputDto = { username: username, password: password };

        const user = await this.authService.usuarioValidar(loginUser);

        return user;
    }
}
