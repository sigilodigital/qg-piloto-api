import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

import { UtilRepository } from '@libs/common/repository/util.repository';
import { MSG } from '@libs/common/services/api-messages';
import { ApiResponse } from '@libs/common/services/api-response';
import { LoginSistemaInputDto } from '../models/dto/loginSistema.dto';
import { MetodoEntity } from '../models/entities/metodo.entity';
import { SistemaMetodoEntity } from '../models/entities/sistema-metodo.entity';
import { SistemaEntity } from '../models/entities/sistema.entity';
import { RotasInternasConfig } from '../utils/rotarInternas-map';

export interface IHandleRequest {
    erro?: any;
    user?: any;
    context?: any;
    info?: any;
}

@Injectable()
export class JwtAuthSystemGuard extends AuthGuard('jwt') {
    public LOG_CLASS_NAME = "JwtAuthGuard";

    private handle: IHandleRequest;
    private entityList: EntityClassOrSchema[];
    private utilRepository: UtilRepository;
    public apiResponse: ApiResponse;

    constructor() {
        super();
        this.entityList = [SistemaEntity, MetodoEntity, SistemaMetodoEntity];
        this.utilRepository = new UtilRepository();
        this.apiResponse = new ApiResponse();

    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        if (!this.handle.user) {
            fnSeTokenInexistente(this.handle, this);
            fnSeTokenInvalido(this.handle, this);
            fnSeTokenExpirado(this.handle, this);
            fnSeTokenMalFormado(this.handle, this);
        }

        return this.handle.user;

        // const sistema = await this.getSystem();
        // fnSeSistemaMetodoNaoEncontrado(sistema, this);
        // fnSeSistemaInativoException(sistema, this);
        // fnSeMetodoInativoException(sistema, this);
        // fnSeMetodoNaoEncontradoException(sistema, this);
        // fnSeMetodoNaoAutorizado();

        // const metodosWs = await this.getMetodosWS(context);

    }

    async getSystem(loginSystem: LoginSistemaInputDto): Promise<SistemaEntity> {
        return <SistemaEntity>await this.utilRepository.findOne({ where: { username: loginSystem.username }, relations: { _metodoList: true } }, SistemaEntity);
    }

    async getMetodosWS(context: ExecutionContext) {
        // let pathMethod = await this.fnLerHeader('methodName');
        // let methodName = fnNormalizarUrlParaMetodo(pathMethod.methodName);
        // // if (methodName) methodName = await this.fnGetMethodInterno(context);
        // if (methodName) {
        //     return await this.utilRepository.findOneBy(MetodoEntity, { name: methodName });
        // } else throwTokenInexistente();

        // function fnNormalizarUrlParaMetodo(url: string) {
        //     url = url.split('?')[0]; //? remove queryParam
        //     url = url.split(/\/\d+$/)[0]; //? remove urlParam
        //     return url;
        // }
    }

    async getSistemaMetodo(_metodo: string, _sistema: string) {
        return <SistemaMetodoEntity>await this.utilRepository.findOne({}, SistemaMetodoEntity); //!ALTERADO
    }

    handleRequest(err: any, user: any, info: any, context: any) {
        this.handle = {
            context: context,
            erro: err == undefined ? null : err,
            info: info == undefined ? null : info,
            user: user == undefined ? null : user
        };
        return user;
    }

    async fnLerHeader(chave: string): Promise<{ methodName: string; }> {
        let metodo = "";
        for (let i = 0; i < this.handle.context.args[0].rawHeaders.length; i++) {
            const cabecalho = this.handle.context.args[0].rawHeaders[i];
            if (cabecalho === chave) {
                metodo = this.handle.context.args[0].rawHeaders[i + 1];
            }
        }

        return {
            methodName: this.fnExtractUrlPartUtil(metodo),
        };
    }

    async fnGetMethodInterno(context: ExecutionContext) {
        const handler = context.getHandler();
        return RotasInternasConfig[handler.name].url;
    }

    fnExtractUrlPartUtil(url: string) {
        const txtUrl = url.replace(/\/\d$/g, '');
        console.log(txtUrl);
        return txtUrl;
    }
}

function fnSeSistemaInativoException<C extends JwtAuthSystemGuard>(sistema: SistemaEntity, C: C) {
    if (sistema.isActive === false) {
        throw new UnauthorizedException(C.apiResponse.handler({
            objMessage: MSG.ERR_AUTH_SYS_INATIV,
            error: {
                message: 'Sistema inativo.',
                context: {
                    className: C.LOG_CLASS_NAME,
                    methodName: null,
                    input: {
                        codAtivo: sistema.isActive,
                        txtDescricao: sistema.description,
                    },
                    output: null
                }
            }
        }));
    }
}

function fnSeMetodoInativoException<C extends JwtAuthSystemGuard>(metodosWs: MetodoEntity, C: C) {
    if (metodosWs.isActive == false) {
        throw new UnauthorizedException(C.apiResponse.handler({
            objMessage: MSG.ERR_AUTH_SYS_N_METODO,
            error: {
                message: 'Método inativo.',
                context: {
                    output: {
                        className: "JwtAuthGuard",
                        methodName: "fnSeMetodoAtivo",
                    }
                }
            }
        }));
    }
};

function fnSeMetodoNaoEncontradoException<C extends JwtAuthSystemGuard>(metodosWs: MetodoEntity, sistema: SistemaEntity, C: C) {
    throw new UnauthorizedException(C.apiResponse.handler({
        objMessage: MSG.ERR_AUTH_SYS_N_METODO,
        error: {
            message: "Metodo não cadastrado para o sistema",
            context: {
                input: {
                    sistema: {
                        txtSegSistemaWs: sistema.name,
                        txtLogin: sistema.username,
                        txtDescricao: sistema.description
                    },
                    metodo: {
                        nome: metodosWs.name,
                        descricao: metodosWs.description
                    }
                },
                output: {

                }
            }
        }
    }));
}

function fnSeMetodoNaoAutorizado<C extends JwtAuthSystemGuard>(methodList: MetodoEntity[], C: C) {
    throw new UnauthorizedException(C.apiResponse.handler({
        objMessage: MSG.ERR_AUTH_SYS_N_METODO,
        error: {
            message: 'O acesso ao método não é permitido.'
        }
    }));
}

function throwTokenInexistente<C extends JwtAuthSystemGuard>(C: C) {
    throw new UnauthorizedException(C.apiResponse.handler({
        objMessage: MSG.ERR_AUTH_TOKEN_N_INFORMED,
        error: {
            message: 'O token do sistema não foi informado ou informado em outro parâmetro.',
            fix: ''
                + '(1) Informar o token do sistema no parametro de cabeçalho correto da requisição. '
                + '(2) Gerar um novo token para o sistema.'
        }
    }));
}

function ThrowTokenInvalido<C extends JwtAuthSystemGuard>(C: C) {
    throw new UnauthorizedException(C.apiResponse.handler({
        objMessage: MSG.ERR_AUTH_TOKEN_INVALID,
        error: {
            message: 'O token do sistema informado está inválido.',
            fix: ''
                + '(1) Adequar o token informado. '
                + '(2) Gerar um novo token para o sistema.'
        }
    }));
}

function throwTokenExpirado<C extends JwtAuthSystemGuard>(C: C) {
    throw new UnauthorizedException(C.apiResponse.handler({
        objMessage: MSG.ERR_AUTH_TOKEN_EXPIRED,
        error: {
            message: 'O token do sistema informado no cabeçalho da requisição foi expirado.',
            fix: ''
                + '(1) Deve ser gerado um novo token.'
        }
    }));
}

function throwTokenMalFormado<C extends JwtAuthSystemGuard>(C: C) {
    throw new UnauthorizedException(C.apiResponse.handler({
        objMessage: MSG.ERR_AUTH_TOKEN_BAD_FORMED,
        error: {
            message: 'O token do sistema informado no cabeçalho da requisição está em formato iválido.',
            fix: ''
                + '(1) Verificar a formatação ou tipo correto (bearer, replace ou outro). '
                + '(2) Gerar um novo token para o sistema.'
        }
    }));
}

function fnSeTokenInexistente<C extends JwtAuthSystemGuard>(handle: IHandleRequest, C: C) {
    if (handle?.info && handle?.info.message == "No auth token") throwTokenInexistente(C);
}

function fnSeTokenInvalido<C extends JwtAuthSystemGuard>(handle: IHandleRequest, C: C) {
    if (handle?.info && handle.info?.message == 'invalid signature' || handle.info?.message == 'invalid token') ThrowTokenInvalido(C);
}

function fnSeTokenExpirado<C extends JwtAuthSystemGuard>(handle: IHandleRequest, C: C) {
    if (handle?.info && handle.info?.message == "jwt expired") throwTokenExpirado(C);
}

function fnSeTokenMalFormado<C extends JwtAuthSystemGuard>(handle: IHandleRequest, C: C) {
    if (handle?.info && handle?.info.message == "jwt malformed") throwTokenMalFormado(C);
}

