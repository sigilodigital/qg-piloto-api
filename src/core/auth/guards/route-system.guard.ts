import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';

import { IUtilRepository, UtilRepository } from '@libs/common/repository/util.repository';
import { ApiResponse } from '@libs/common/services/response-handler';
import { UtilService } from '@libs/common/services/util.service';
import configs from '@libs/common/configs';
import { MSG } from '@libs/common/services/code-messages';
import { MetodoEntity } from '../models/entities/metodo.entity';
import { SistemaMetodoEntity } from '../models/entities/sistema-metodo.entity';
import { SistemaEntity } from '../models/entities/sistema.entity';

@Injectable()
export class RouteSystemGuard implements CanActivate {

    private utilRepository: IUtilRepository;
    private utilService: UtilService;
    private entityList = [SistemaEntity, MetodoEntity, SistemaMetodoEntity];
    public apiResponse: ApiResponse;

    constructor() {
        this.utilRepository = new UtilRepository();
        this.utilService = new UtilService();
        this.apiResponse = new ApiResponse();
    }

    async canActivate(context: ExecutionContext | { req: Request, res: Response; }): Promise<boolean> {

        await this.utilRepository.init(this.entityList);

        const request = this.pegarRequisicaoDoContextoDaExecucao(context);

        const token = this.extrairTokenDaRequisicao(request);
        fnSeTokenInexistente(token, this);
        const tokenInfo = await this.tokenVerificar(token);
        await this.tokenValidar(tokenInfo, token);

        return true;
    }

    private pegarRequisicaoDoContextoDaExecucao(context: ExecutionContext | { req: Request, res: Response; }): Request {
        return (context['req'] && context['res'])
            ? context['req']
            : <Request>context['switchToHttp']().getRequest();
    }

    private extrairTokenDaRequisicao(request: Request): string | null {
        return <string | null>request.headers['token-system'];
    }

    private async tokenVerificar(token: string): Promise<ITokenInfoSystem> {
        token = token.replace(/^.*\s/, '');
        try {
            const result = <ITokenInfoSystem><unknown>await this.utilService.tokenVerify(token, { secret: configs().auth.secretKey });
            return result;
        } catch (error) {
            fnSeTokenInvalido(error, this);
        }
    }

    private async tokenDecode(token: string): Promise<ITokenInfoSystem> {
        try {
            const result = <ITokenInfoSystem>this.utilService.tokenDecodeWithoutVerify(token);
            return result;
        } catch (error) {
            fnSeTokenInvalido(error, this);
        }
    }

    private async tokenValidar(tokenInfo: ITokenInfoSystem, token: string): Promise<void> {
        fnSeTokenExpirado(tokenInfo, this);
        fnSeTokenMalFormado(tokenInfo, token, this);
    }
}

interface ITokenInfoSystem {
    iat: number;
    exp: number;
    systemDataLogin: {
        sistema: SistemaEntity;
        sistemaMetodo: SistemaMetodoEntity;
    };
}

function fnSeTokenInexistente<C extends RouteSystemGuard>(token: string, C: C) {
    if (!token) throwTokenInexistente(C);
}

function fnSeTokenInvalido<C extends RouteSystemGuard>(error: JsonWebTokenError, C: C) {
    if (error.message == 'No auth token') throwTokenInexistente(C);
    if (error.message == 'invalid token') ThrowTokenInvalido(C);
    if (error.message == 'invalid signature') ThrowTokenAssinaturaInvalida(C);
    if (error.message == 'jwt expired') throwTokenExpirado(C);
    if (error.message == 'jwt malformed') throwTokenMalFormado(C);
}

function fnSeTokenExpirado<C extends RouteSystemGuard>(tokenInfo: ITokenInfoSystem, C: C) {
    if (tokenInfo.exp > Date.now()) throwTokenExpirado(C);
}

function fnSeTokenMalFormado<C extends RouteSystemGuard>(tokenInfo: ITokenInfoSystem, token: string, C: C) {
    if (!token.match(/^(Bearer|Replace|System)/)) throwTokenMalFormado(C);
}


function throwTokenInexistente<C extends RouteSystemGuard>(C: C) {
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

function ThrowTokenInvalido<C extends RouteSystemGuard>(C: C) {
    throw new UnauthorizedException(C.apiResponse.handler({
        objMessage: MSG.ERR_AUTH_TOKEN_INVALID,
        error: {
            message: 'O token do sistema informado está em formato inválido.',
            fix: ''
                + '(1) Adequar o token informado. '
                + '(2) Gerar um novo token para o sistema.'
        }
    }));
}

function ThrowTokenAssinaturaInvalida<C extends RouteSystemGuard>(C: C) {
    throw new UnauthorizedException(C.apiResponse.handler({
        objMessage: MSG.ERR_AUTH_TOKEN_ASSIN_INVALID,
        error: {
            message: 'O token do sistema informado foi possivelmente modificado e está com assinatura inválida.',
            fix: ''
                + '(1) Adequar o token informado. '
                + '(2) Gerar um novo token para o sistema.'
        }
    }));
}

function throwTokenExpirado<C extends RouteSystemGuard>(C: C) {
    throw new UnauthorizedException(C.apiResponse.handler({
        objMessage: MSG.ERR_AUTH_TOKEN_EXPIRED,
        error: {
            message: 'O token do sistema informado no cabeçalho da requisição foi expirado.',
            fix: ''
                + '(1) Deve ser gerado um novo token.'
        }
    }));
}

function throwTokenMalFormado<C extends RouteSystemGuard>(C: C) {
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
