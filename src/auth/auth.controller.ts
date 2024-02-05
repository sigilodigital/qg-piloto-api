import { Body, Controller, Post, Request, Response, UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody } from '@nestjs/swagger';
import { Response as IResponse, Request as RequestExpress } from 'express';
import { HttpExceptionFilter } from 'src/shared/http-exception-filter';
import { ValidationPipe } from 'src/shared/validation/validation.pipe';
import { ApiResponse, IAPIResponse } from './../shared/response-handler';
import { AuthService, ILoginSistema } from './auth.service';
import { LoginSistema } from './models/dto/loginSistema.dto';
import { LoginUser } from './models/dto/login-user.dto';
import { JwtAuthSystemGuard } from './guards/jwt-auth-system.guard';
import { ValidateAuthSystemGuard } from './validates/validate-auth-system.guard';
import { ValidateAuthUserGuard } from './validates/validate-auth-user.guard';
import { UserDto } from './models/dto/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authservice: AuthService) { }

    @ApiBody({ type: LoginUser })
    @UseGuards(AuthGuard('login-user-strategy'))
    @UseGuards(JwtAuthSystemGuard)
    @UseGuards(ValidateAuthUserGuard)
    @UseFilters(HttpExceptionFilter)
    @Post('usuario-senha-validar')
    async usuarioSenhaValidar(@Request() req: RequestExpress & {user: IAPIResponse<UserDto>}, @Response() res: IResponse): Promise<any> {

        const result = req.user.data;
        
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
    @UseGuards(AuthGuard('login-system-strategy'))
    @UseGuards(ValidateAuthSystemGuard)
    @UseFilters(HttpExceptionFilter)
    @Post('sistema-senha-validar')
    async sistemaSenhaValidar(@Request() req: RequestExpress & {user: IAPIResponse<UserDto>}, @Response() res: IResponse) {
        
        const result = req.user.data;

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
