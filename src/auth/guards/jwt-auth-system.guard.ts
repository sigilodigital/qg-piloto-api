import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

import { UtilRepository } from '@libs/common/repository/util.repository';
import { ApiResponse } from '../../shared/response-handler';
import { SistemaEntity } from '../models/entities/sistema.entity';
import { RotasInternasConfig } from '../utils/rotarInternas-map';
import { MetodoEntity } from '../models/entities/metodo.entity';
import { SistemaMetodoEntity } from '../models/entities/sistema-metodo.entity';

export interface IHandleRequest {
    erro?: any;
    user?: any;
    context?: any;
    info?: any;
}

@Injectable()
export class JwtAuthSystemGuard extends AuthGuard('jwt') {
    private handle: IHandleRequest;
    private className = "JwtAuthGuard";
    private entityList : EntityClassOrSchema[];
    private utilRepository: UtilRepository;

    constructor() {
        super();
        this.entityList = [SistemaEntity, MetodoEntity, SistemaMetodoEntity];
        this.utilRepository = new UtilRepository();

    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);
        (await this.utilRepository.init(this.entityList));

        if (!this.handle.user) {
            fnSeInvalideToken(this.handle);
            fnSeTokenExpirado(this.handle);
            fnSeTokenInexistente(this.handle);
            fnSeTokenMalFormado(this.handle);
        } else {
            const sistema = await this.getSistema();
            if (sistema) {
                fnSeSistemaInativoException(this, sistema);

                const metodosWs = await this.getMetodosWS(context);

                if (metodosWs) {
                    fnSeMetodoInativoException(metodosWs);
                    const sistemaMetodoWs = await this.getSistemaMetodo('ALTERADO', sistema.id); //!ALTERADO
                    if (!sistemaMetodoWs)
                        fnSeMetodoNaoEncontradoException(metodosWs, sistema);

                    return this.handle.user;
                } else fnMetodoNaoAutorizado();
            } else fnSeSistemaMetodoNaoEncontrado();
        }
    }

    async getSistema() {
        return await this.utilRepository.findOneBy(SistemaEntity, { username: this.handle.user['systemDataLogin']['username'] });
    }

    async getMetodosWS(context: ExecutionContext) {
        let pathMethod = await this.fnLerHeader('methodName');
        let methodName = fnNormalizarUrlParaMetodo(pathMethod.methodName)
        // if (methodName) methodName = await this.fnGetMethodInterno(context);
        if (methodName) {
            return await this.utilRepository.findOneBy(MetodoEntity, { nome: methodName });
        } else fnFalhaTokenInexistente();

        function fnNormalizarUrlParaMetodo(url: string){
            url = url.split('?')[0] //? remove queryParam
            url = url.split(/\/\d+$/)[0] //? remove urlParam
            return url
        }
    }

    async getSistemaMetodo(_metodo: string, _sistema: string) {
        return await this.utilRepository.findOne(SistemaMetodoEntity, {  }); //!ALTERADO
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

function fnSeSistemaInativoException(thiss: any, sistema: SistemaEntity) {
    if (sistema.isActive === false) {
        throw new UnauthorizedException(ApiResponse.handler({
            codNumber: 7,
            outputError: {
                message: 'Sistema inativo.',
                context: {
                    input: {
                        codAtivo: sistema.isActive,
                        txtDescricao: sistema.description,

                    },
                    output: {
                        className: thiss.className,
                        methodName: "fnSeSistemaAtivo"
                    }
                }
            }
        }));
    }
}

function fnSeMetodoInativoException(metodosWs: MetodoEntity) {
    if (metodosWs.seAtivo == false) {
        throw new UnauthorizedException(ApiResponse.handler({
            codNumber: 7,
            outputError: {
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
}

function fnSeMetodoNaoEncontradoException(metodosWs: MetodoEntity, sistema: SistemaEntity) {
    throw new UnauthorizedException(ApiResponse.handler({
        codNumber: 8,
        outputError: {
            message: "Metodo não cadastrado para o sistema",
            context: {
                input: {
                    sistema: {
                        txtSegSistemaWs: sistema.name,
                        txtLogin: sistema.username,
                        txtDescricao: sistema.description
                    },
                    metodo: {
                        nome: metodosWs.nome,
                        descricao: metodosWs.descricao
                    }
                },
                output: {

                }
            }
        }
    }));
}

function fnMetodoNaoAutorizado() {
    throw new UnauthorizedException(ApiResponse.handler({
        codNumber: 5,
        outputError: {
            message: 'O acesso ao método não é permitido.'
        }
    }));
}

function fnFalhaTokenInexistente() {
    throw new UnauthorizedException(ApiResponse.handler({
        codNumber: 77,
        outputError: {
            message: 'Token não informado no cabeçalho.'
        }
    }));
}

function fnFalhaTokenInvalido() {
    throw new UnauthorizedException(ApiResponse.handler({
        codNumber: 78,
        outputError: {
            message: 'Token informado é inválido.'
        }
    }));
}

function fnFalhaTokenExpirado() {
    throw new UnauthorizedException(ApiResponse.handler({
        codNumber: 79,
        outputError: {
            message: 'Token informado expirado.'
        }
    }));
}

function fnFalhaTokenMalFormado() {
    throw new UnauthorizedException(ApiResponse.handler({
        codNumber: 80,
        outputError: {
            message: 'Token mal formado.'
        }
    }));
}

function fnSeSistemaMetodoNaoEncontrado() {
    throw new UnauthorizedException(ApiResponse.handler({
        codNumber: 5,
        outputError: {
            message: 'Sistema metodo não encontradi'
        }
    }));
}

function fnSeInvalideToken(handle: IHandleRequest) {
    if (handle?.info && handle.info?.message == 'invalid signature' || handle.info?.message == 'invalid token') fnFalhaTokenInvalido();
}

function fnSeTokenExpirado(handle: IHandleRequest) {
    if (handle?.info && handle.info?.message == "jwt expired") fnFalhaTokenExpirado();
}

function fnSeTokenInexistente(handle: IHandleRequest) {
    if (handle?.info && handle?.info.message == "No auth token") fnFalhaTokenInexistente();
}

function fnSeTokenMalFormado(handle: IHandleRequest) {
    if (handle?.info && handle?.info.message == "jwt malformed") fnFalhaTokenMalFormado();
}

