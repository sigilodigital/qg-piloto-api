import { Body, Controller, Post, Request, Response, UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody } from '@nestjs/swagger';
import { Response as IResponse } from 'express';
import { HttpExceptionFilter } from 'src/shared/http-exception-filter';
import { ValidationPipe } from 'src/shared/validation/validation.pipe';
import { ApiResponse, IAPIResponse } from './../shared/response-handler';
import { AuthService, ILoginSistema } from './auth.service';
import { LoginSistema } from './dto/loginSistema.dto';
import { LoginUser } from './dto/login-user.dto';
import { JwtAuthSystemGuard } from './guards/jwt-auth-system.guard';
import { ValidaAuthSystemGuard } from './guards/valida-auth-system.guard';
import { ValidaAuthUserGuard } from './guards/valida-auth-user.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authservice: AuthService) { }

    @ApiBody({ type: LoginUser })
    @UseGuards(AuthGuard('login-user-strategy'))
    @UseGuards(JwtAuthSystemGuard)
    @UseGuards(ValidaAuthUserGuard)
    @UseFilters(HttpExceptionFilter)
    @Post('usuario-senha-validar')
    async usuarioSenhaValidar(@Request() req: any, @Response() res: IResponse): Promise<any> {

        const result = (<IAPIResponse<LoginPessoa>>req.user).data;
        
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

    @ApiBody({ type: LoginSistema })
    @UseGuards(AuthGuard('login-sistema-strategy'))
    @UseGuards(ValidaAuthSystemGuard)
    @UseFilters(HttpExceptionFilter)
    @Post('sistema-senha-validar')
    async sistemaSenhaValidar(@Request() req: any, @Response() res: IResponse) {
        
        const result = (<IAPIResponse<ILoginPessoa['output']>>req.user).data;

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
    async validarAcessoApi(@Request() req: any, @Response() res: IResponse) {
        return res.json({ authorization: true });
    }


}
