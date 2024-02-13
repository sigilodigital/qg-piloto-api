import { Controller, Post, Request, Response, UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';
import { Request as RequestExpress, Response as ResponseExpress } from 'express';

// import { ApiResponse, IAPIResponse } from './../shared/response-handler';
import { MSG } from '@libs/common/services/code-messages';
import { HttpExceptionFilter } from '@libs/common/services/http-exception-filter';
import { ApiResponse } from '@libs/common/services/response-handler';
import { AuthService } from './auth.service';
import { JwtAuthSystemGuard } from './guards/jwt-auth-system.guard';
import { LoginUserInputDto, LoginUserOutputDto } from './models/dto/login-user.dto';
import { LoginSistemaInputDto, LoginSistemaOutputDto } from './models/dto/loginSistema.dto';
import { AuthSystemValidate } from './validates/auth-system.validate';
import { AuthUserValidate } from './validates/auth-user.validate';
import configs from '@libs/common/configs';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authservice: AuthService, private apiResponse: ApiResponse<LoginUserInputDto, unknown>) { }

    @ApiBody({ type: LoginUserInputDto, examples: { usuario_teste: { value: { username: 'abcd', password: 'abcd1234' } } } })
    @UseGuards(AuthGuard('user-strategy'))
    @UseGuards(AuthUserValidate)
    // TODO: Trocar a validacao de JWT do sistema, pq esta parece não poder alterar o parametro de recebimento do token (Authentication no cabecalho), conflita com a autenticação do usuario
    // @UseGuards(JwtAuthSystemGuard)
    @UseFilters(HttpExceptionFilter)
    @Post('usuario-autenticar')
    async usuarioAutenticar(@Request() req: RequestExpress & { user: LoginUserOutputDto; }, @Response() res: ResponseExpress): Promise<any> {

        const token = await fnGerarToken(req.user, this);
        let user = fnInserirTokenNaResposta(req.user, token);

        if ((await fnSeExigirAlteracaoDeSenha(user, this))) return;

        const result = this.apiResponse.handler({ objMessage: MSG.DEFAULT_SUCESSO, output: user, warning: { message: 'Conferir o codMessage correto' } });
        res.json(result);

        async function fnSeExigirAlteracaoDeSenha(user: LoginUserOutputDto, thiss: AuthController) {
            if (user.__params.isPasswordRequireChange === true) {
                res.json(thiss.apiResponse.handler({ objMessage: MSG.DEFAULT_SUCESSO, output: user }));
                return true;
            }
            return false;
        }

        async function fnGerarToken(user: LoginUserOutputDto, thiss: AuthController) {
            // TODO: melhoria: centralizar as configurações do tokenGenerate
            return {
                bearer: await thiss.authservice.tokenGenerate(user, { expiresIn: configs().auth.expiresIn.bearer }),
                replace: await thiss.authservice.tokenGenerate(null, { expiresIn: configs().auth.expiresIn.replace })
            };
        }

        function fnInserirTokenNaResposta(user: LoginUserOutputDto, token: LoginUserOutputDto['token']): LoginUserOutputDto {
            user.token = token;
            res.header('token-bearer', token.bearer);
            res.header('token-replace', token.replace);
            return user;
        }
    }

    @ApiBody({ type: LoginSistemaInputDto, examples: { teste_1: { value: { username: 'sd-portal', password: 'abcd1234' } } } })
    @UseGuards(AuthGuard('system-strategy'))
    @UseGuards(AuthSystemValidate)
    @UseFilters(HttpExceptionFilter)
    @Post('sistema-autenticar')
    async sistemaSenhaValidar(@Request() req: RequestExpress & { user: LoginSistemaOutputDto; }, @Response() res: ResponseExpress) {

        let result: LoginSistemaOutputDto = req.user;

        const token = await this.authservice.tokenGenerate(result, { expiresIn: '24h' });
        result = fnInserirTokenNaResposta(req.user, token);

        return res.json(this.apiResponse.handler({ objMessage: MSG.DEFAULT_SUCESSO, output: result }));

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
