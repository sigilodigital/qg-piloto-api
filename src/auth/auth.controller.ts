import { Controller, Post, Request, Response, UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody } from '@nestjs/swagger';
import { Response as ResponseExpress, Request as RequestExpress } from 'express';

// import { ApiResponse, IAPIResponse } from './../shared/response-handler';
import { AuthService } from './auth.service';
import { JwtAuthSystemGuard } from './guards/jwt-auth-system.guard';
import { LoginUserInputDto, LoginUserOutputDto } from './models/dto/login-user.dto';
import { LoginSistemaInputDto, LoginSistemaOutputDto } from './models/dto/loginSistema.dto';
import { UserDto } from './models/dto/user.dto';
import { AuthUserValidate } from './validates/auth-user.validate';
import { AuthSystemValidate } from './validates/auth-system.validate';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { HttpExceptionFilter } from '@libs/common/services/http-exception-filter';
import { ApiResponse } from '@libs/common/services/response-handler-v2';

@Controller('auth')
export class AuthController {
    constructor(private readonly authservice: AuthService, private apiResponse: ApiResponse<LoginUserInputDto, unknown>) { }

    @ApiBody({ type: LoginUserInputDto })
    // @UseGuards(AuthGuard('login-user-strategy'))
    // @UseGuards(JwtAuthSystemGuard)
    @UseGuards(LocalAuthGuard)
    @UseGuards(AuthUserValidate)
    @UseFilters(HttpExceptionFilter)
    @Post('usuario-validar')
    async usuarioSenhaValidar(@Request() req: RequestExpress & { user: LoginUserOutputDto; }, @Response() res: ResponseExpress): Promise<any> {

        const token = await fnGerarToken(req.user, this);
        let user = fnInserirTokenNaResposta(req.user, token);

        if ((await fnSeExigirAlteracaoDeSenha(user, this))) return;

        return res.json(this.apiResponse.handler({ codMessage: 1, output: user, warning: { message: 'Conferir o codMessage correto' } }));

        async function fnSeExigirAlteracaoDeSenha<C extends AuthController>(user: LoginUserOutputDto, C: C) {
            if (user.__params.isPasswordRequireChange === true) {
                // TODO: inserir codigo referente
                res.json(C.apiResponse.handler({ codMessage: 0, output: user }));
                return true;
            }
            return false;
        }

        async function fnGerarToken<C extends AuthController>(user: LoginUserOutputDto, C: C) {
            return {
                bearer: await C.authservice.tokenGenerate(user, { expiresIn: '1h' }),
                replace: await C.authservice.tokenGenerate({}, { expiresIn: '24h' })
            };
        }

        function fnInserirTokenNaResposta(user: LoginUserOutputDto, token: LoginUserOutputDto['token']): LoginUserOutputDto {
            res.header('tokenBearer', token.bearer);
            res.header('tokenReplace', token.replace);
            user['token'] = token;
            return user;
        }
    }

    @ApiBody({ type: LoginSistemaInputDto })
    @UseGuards(AuthGuard('login-system-strategy'))
    @UseGuards(AuthSystemValidate)
    @UseFilters(HttpExceptionFilter)
    @Post('sistema-senha-validar')
    async sistemaSenhaValidar(@Request() req: RequestExpress & { user: LoginSistemaOutputDto; }, @Response() res: ResponseExpress) {

        let result: LoginSistemaOutputDto = req.user;

        const token = await this.authservice.tokenGenerate(result, { expiresIn: '24h' });
        result = fnInserirTokenNaResposta(req.user, token);

        return res.json(this.apiResponse.handler({ codMessage: 1, output: result }));

        function fnInserirTokenNaResposta(user: LoginSistemaOutputDto, token: string): LoginSistemaOutputDto {
            res.header('tokenSystem', token);
            user.token = token;
            return user;
        }
    }

    @UseGuards(JwtAuthSystemGuard)
    @Post('validar-acesso-api')
    async validarAcessoApi(@Request() req: any, @Response() res: ResponseExpress) {
        return res.json({ authorization: true });
    }


}
