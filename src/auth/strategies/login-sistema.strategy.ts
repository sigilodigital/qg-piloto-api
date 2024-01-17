import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { GlobalService } from 'src/shared/services/global.service';
import { AuthService } from '../auth.service';

@Injectable()
export class LoginSistemaStrategy extends PassportStrategy(Strategy, "login-sistema-strategy") {
    constructor(private moduleRef: ModuleRef, private readonly authService: AuthService) {
        super({ passReqToCallback: true, usernameField: 'txtLogin', passwordField: 'txtSenha' });
    }

    async validate(request: Request, username: string, password: string): Promise<any> {

        GlobalService.enableDebugModeHeader = JSON.parse(request.headers['debug-mode'] || 'false');

        const user = await this.authService.validarSistema({ txtLogin: username, txtSenha: password });

        return user;
    }
} 
