import { Controller, Post, Request, Response, UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody } from '@nestjs/swagger';
import { Response as ResponseExpress, Request as RequestExpress } from 'express';

import { ApiResponse, IAPIResponse } from './../shared/response-handler';
import { AuthService } from './auth.service';
import { JwtAuthSystemGuard } from './guards/jwt-auth-system.guard';
import { LoginUserInputDto, LoginUserOutputDto } from './models/dto/login-user.dto';
import { LoginSistemaInputDto } from './models/dto/loginSistema.dto';
import { UserDto } from './models/dto/user.dto';
import { AuthUserValidate } from './validates/auth-user.validate';
import { AuthSystemValidate } from './validates/auth-system.validate';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { HttpExceptionFilter } from '@libs/common/services/http-exception-filter';

@Controller('auth')
export class AuthController {
    constructor(private readonly authservice: AuthService) { }

    @ApiBody({ type: LoginUserInputDto })
    // @UseGuards(AuthGuard('login-user-strategy'))
    // @UseGuards(JwtAuthSystemGuard)
    @UseGuards(LocalAuthGuard)
    @UseGuards(AuthUserValidate)
    @UseFilters(HttpExceptionFilter)
    @Post('usuario-validar')
    async usuarioSenhaValidar(@Request() req: RequestExpress & {user: LoginUserOutputDto}, @Response() res: ResponseExpress): Promise<any> {

        const result = req.user;
        
        const token = await this.authservice.tokenUserGenerate(result);
        fnInserirTokenNoHeader()
        fnInserirTokenNoBody()

        await fnSeExigirAlteracaoDeSenha(result);
        res.json(ApiResponse.handler({ codNumber: (result) ? 46 : 47, output: result }));

        function fnSeExigirAlteracaoDeSenha(usuario) {
            if (usuario.codSenhaAlterada === 1) {
                return ApiResponse.handler({
                    codNumber: 44,
                    output: usuario
                });
            }
        }

        function fnInserirTokenNoHeader(){
            res.header('tokenUser', token);
        }

        function fnInserirTokenNoBody(){
            req.user['data']['tokenUser'] = token;
        }
    }

    @ApiBody({ type: LoginSistemaInputDto })
    @UseGuards(AuthGuard('login-system-strategy'))
    @UseGuards(AuthSystemValidate)
    @UseFilters(HttpExceptionFilter)
    @Post('sistema-senha-validar')
    async sistemaSenhaValidar(@Request() req: RequestExpress & {user: IAPIResponse<UserDto>}, @Response() res: ResponseExpress) {
        
        const result = req.user;

        const token = await this.authservice.tokenSystemGenerate(result);
        fnInserirTokenNoHeader()
        fnInserirTokenNoBody()
        return res.json(req.user);

        function fnInserirTokenNoHeader(){
            res.header('tokenSystem', token);
        }

        function fnInserirTokenNoBody(){
            req.user['data']['tokenSystem'] = token;
        }
    }

    @UseGuards(JwtAuthSystemGuard)
    @Post('validar-acesso-api')
    async validarAcessoApi(@Request() req: any, @Response() res: ResponseExpress) {
        return res.json({ authorization: true });
    }


}
