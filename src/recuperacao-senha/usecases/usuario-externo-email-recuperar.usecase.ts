import { UtilRepository } from "@libs/common/repository/util.repository";
import { ApiResponse } from "@libs/common/services/response-handler";
import { BadRequestException } from "@nestjs/common";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { Request } from "express";
import { InteressadoEntity } from "src/interessado/entities/interessado.entity";
import { encrypt } from "src/shared/utils";
import { SegConfiguracao } from "src/sistema-mensagem-fila/dto/configuracao.dto";
import { ISistemaMensagemFilaCreate, SistemaMensagemFilaService } from "src/sistema-mensagem-fila/sistema-mensagem-fila.service";
import { UsuarioExterno } from "src/usuario-externo/entities/usuario-externo.entity";
import { UtilsService } from "src/utils/utils.service";
import { IUsuarioExternoSenhaEmailRecuperar } from "../dto/usuario-externo-senha-email-recuperar.dto";


export class UsuarioExternoEmailRecuperarUseCase {
    private entityList: EntityClassOrSchema[];
    private className = 'UsuarioExternoEmailRecuperarUseCase';

    constructor(
        private utilRepository: UtilRepository,
        private utilService: UtilsService,
        private sistemaMensagemFilaService: SistemaMensagemFilaService
        ) {
        this.entityList = [InteressadoEntity, UsuarioExterno, SegConfiguracao]
    }

    async handler(usuarioExternoSenhaEmailRecuperar: IUsuarioExternoSenhaEmailRecuperar['input'], request: Request, interessado: InteressadoEntity) {
        const result = await this.usuarioExternoEmailRecuperar(usuarioExternoSenhaEmailRecuperar, interessado);
        return result
    }

    private async usuarioExternoEmailRecuperar(usuarioExternoSenhaEmailRecuperar: IUsuarioExternoSenhaEmailRecuperar['input'], interessado: InteressadoEntity) {
        try {
            this.seInteressadoEncontrado(usuarioExternoSenhaEmailRecuperar, interessado);
            this.fnThrowSeInativo(interessado);
    
            if (interessado) {
                this.fnThrowSeInativo(interessado);
                const usuarioExterno = await this.utilRepository.findOne(UsuarioExterno, {  codInteressado: interessado.codInteressado } );
                if (usuarioExterno) {
                    this.fnThrowSeInativo(usuarioExterno);
                    this.fnThrowSeEmailDiferente(usuarioExterno.txtEmail, usuarioExternoSenhaEmailRecuperar.txtEmail);
                    if (await this.fnGerarNovaSenhaUsuarioExterno(usuarioExterno)) {
                        await this.enviarEmail(usuarioExterno, 'cod_modelo_email_senha_regerada');
                    } else {
                        this.erroAoGerarNovaSenha(usuarioExternoSenhaEmailRecuperar);
                    }
                    return this.fnGetMessage15(interessado);
                } else {
                    this.usuarioExternoNaoExisteException(interessado);
                }
            }
        } catch (error) {
            return error.response;
        }
    }

    private fnThrowSeEmailDiferente(email_1: string, email_2: string) {
        const methodName = "async function fnThrowSeEmailDiferente(email_1: string, email_2: string)";
        if (email_1 !== email_2) {
            throw new BadRequestException(ApiResponse.handler({
                codMessage: 47,
                property: 'txtEmail',
                valueArg: email_2,
                error: {
                    message: 'Os valores de email estão diferentes.',
                    context: {
                        output: {
                            className: this.className,
                            methodName: methodName
                        }
                    }
                }
            }));
        }
    }

    private usuarioExternoNaoExisteException(interessado: InteressadoEntity) {
        return ApiResponse.handler({
            codMessage: 9,
            property: 'txtCnpjCpf',
            valueArg: interessado.txtCnpjCpf,
            input: interessado
        });
    }

    private fnGetMessage15(interessado: InteressadoEntity) {
        return ApiResponse.handler({
            codMessage: 15,
            property: 'txtCnpjCpf',
            valueArg: interessado.txtCnpjCpf,
            input: interessado,
            output: { codInteressado: interessado.codInteressado, txtCnpjCpf: interessado.txtCnpjCpf }
        })
    }

    private erroAoGerarNovaSenha(usuarioExternoSenhaEmailRecuperar: { txtCnpjCpf: string; txtEmail: string; }) {
        throw new BadRequestException(ApiResponse.handler({
            codMessage: 43,
            input: { usuarioExternoSenhaEmailRecuperar },
            error: {
                message: "Atualização não realizada!",
                context: {
                    output: {
                        className: this.className,
                        methodName: ''
                    }
                }
            }
        }))
    }

    async enviarEmail(usuarioExterno: UsuarioExterno, codModeloEmail: string) {
        const input: ISistemaMensagemFilaCreate['input'] = {
            usuarioExterno,
            codModeloEmail
        };

        const email = await this.sistemaMensagemFilaService.create(input);
        if (email) {
            return ApiResponse.handler({
                codMessage: 40,
                output: null
            });
        }
    }

    async fnGerarNovaSenhaUsuarioExterno(usuarioExterno: UsuarioExterno) {
        const novaSenha = this.gerarNovaSenha();
        const upUE = new UsuarioExterno(usuarioExterno);
        upUE.codSenhaAlterada = 1;
        upUE.codSenhaBloqueada = 0;
        upUE.codSenhaIncorreta = 0;
        upUE.txtSenha = (await encrypt(novaSenha)).hash;
        const updateUsuarioExterno = await this.utilRepository.update(UsuarioExterno, {codUsuarioExterno: upUE.codUsuarioExterno}, upUE );
        return updateUsuarioExterno
    }
    
    seInteressadoAtivoException(interessado: InteressadoEntity) {
        if (interessado.codAtivo == 0)
            throw new BadRequestException(ApiResponse.handler({
                codMessage: 45
            }));
    }

    private gerarNovaSenha() {
        return this.utilService.codigoVerificacaoGerar('#Ik2');
    }

    private seInteressadoEncontrado(usuarioExternoSenhaEmailRecuperar: IUsuarioExternoSenhaEmailRecuperar['input'], interessado: InteressadoEntity) {
        if(!interessado)
            throw new BadRequestException(ApiResponse.handler({
                codMessage: 16,
                output: interessado,
                property: 'txtCnpjCpf',
                valueArg: usuarioExternoSenhaEmailRecuperar.txtCnpjCpf
            }))
    }

    private fnThrowSeInativo(obj: unknown & { codAtivo: number; }): void {
        if (!obj.codAtivo) {
            throw new BadRequestException(ApiResponse.handler({
                codMessage: 45
            }));
        }
    }
}