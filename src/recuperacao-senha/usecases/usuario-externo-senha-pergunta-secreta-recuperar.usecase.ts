import { UtilRepository } from "@libs/common/repository/util.repository";
import { ApiResponse } from "@libs/common/services/response-handler";
import { BadRequestException } from "@nestjs/common";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { InteressadoEntity } from "src/interessado/entities/interessado.entity";
import { ISistemaMensagemFilaCreate, SistemaMensagemFilaService } from "src/sistema-mensagem-fila/sistema-mensagem-fila.service";
import { UsuarioExterno } from "src/usuario-externo/entities/usuario-externo.entity";
import { UtilsService } from "src/utils/utils.service";
import { UsuarioExternoSenhaPerguntaSecretaRecuperar } from "../dto/usuario-externo-senha-pergunta-secreta-recuperar.dto";

export class UsuarioExternoSenhaPerguntaSecretaRecuperarUseCase { 
    private className = 'UsuarioExternoSenhaPerguntaSecretaRecuperarUseCase';
    private entityList: EntityClassOrSchema[];
    private qtdTentativasErradas = 6;

    constructor(
        private utilRepository: UtilRepository,
        private utilService: UtilsService,
        private sistemaMensagemFilaService: SistemaMensagemFilaService
        ) {}
    
    async handler(usuarioExternoSenhaPerguntaSecretaRecuperar: UsuarioExternoSenhaPerguntaSecretaRecuperar){
        const result = await this.usuarioExternoSEnhaPerguntaSecretaRecuperar(usuarioExternoSenhaPerguntaSecretaRecuperar);
        return result
    }

    async usuarioExternoSEnhaPerguntaSecretaRecuperar(usuarioExternoSenhaPerguntaSecretaRecuperar: UsuarioExternoSenhaPerguntaSecretaRecuperar) {
        try {
            const interessado = await this.utilRepository.findOne(InteressadoEntity, {  txtCnpjCpf: usuarioExternoSenhaPerguntaSecretaRecuperar.txtCnpjCpf } );
            if (interessado) {
                this.fnThrowSeCodAtivo(interessado);
                const usuarioExterno = await this.utilRepository.findOne(UsuarioExterno, {  codInteressado: interessado.codInteressado } );

                if (usuarioExterno) {
                    this.fnThrowSeCodAtivo(usuarioExterno);
                    this.fnSePergSecrBloqueada(usuarioExterno);
                    await this.fnValidaSeCodPerguntaSecretaCorresponde(usuarioExterno, usuarioExternoSenhaPerguntaSecretaRecuperar);
                } else {
                    this.fnUsuarioExternoInexistenteThrowException(usuarioExternoSenhaPerguntaSecretaRecuperar);
                }
            } else {
                this.fnInteressadoInexistenteThrowException();
            }
        } catch (error) {
            return error.response
        }
    }

    fnInteressadoInexistenteThrowException() {
        throw new BadRequestException(ApiResponse.handler({
            codNumber: 16
        }));
    }

    fnUsuarioExternoInexistenteThrowException(usuarioExternoSenhaPerguntaSecretaRecuperar: UsuarioExternoSenhaPerguntaSecretaRecuperar) {
        throw new BadRequestException(ApiResponse.handler({
            codNumber: 9,
            input: usuarioExternoSenhaPerguntaSecretaRecuperar,
            property: 'txtCnpjCpf',
            valueArg: usuarioExternoSenhaPerguntaSecretaRecuperar.txtCnpjCpf
        }));
    }

    private async fnValidaSeCodPerguntaSecretaCorresponde(usuarioExterno: UsuarioExterno, usuarioExternoSenhaPerguntaSecretaRecuperar: UsuarioExternoSenhaPerguntaSecretaRecuperar) {
        // try {
            if(this.sePerguntaInformadaForDiferente(usuarioExterno, usuarioExternoSenhaPerguntaSecretaRecuperar)){
                await this.fnIncrementaTentativasErradas(usuarioExterno);
                if(usuarioExterno.codTentativaPergunta > this.qtdTentativasErradas)
                    await this.bloqueiaPerguntaSecreta(usuarioExterno, usuarioExternoSenhaPerguntaSecretaRecuperar);
                await this.fnDadosNaoConferemException(usuarioExterno, usuarioExternoSenhaPerguntaSecretaRecuperar);
            }
            
            return await this.fnAtualizaNovaSenha(usuarioExterno, usuarioExternoSenhaPerguntaSecretaRecuperar);
            
        // } catch (error) {
        //     return error.response
        // }
    }

    /**
    * Senha validada.
    * o	Criptografar a nova senha informada.
    * o	Atualizar o registro do usuário externo com a nova senha criptografada e zerar os contadores de 
    * senha e pergunta secreta do usuário externo. Item 1.8.2.
    */
    async fnAtualizaNovaSenha(usuarioExterno: UsuarioExterno, usuarioExternoSenhaPerguntaSecretaRecuperar: UsuarioExternoSenhaPerguntaSecretaRecuperar) {
        const ue = new UsuarioExterno(usuarioExterno);
        ue.codUsuarioExterno = usuarioExterno.codUsuarioExterno;
        ue.codInteressado = usuarioExterno.codInteressado;
        ue.txtSenha = (await this.utilService.encryptText(usuarioExternoSenhaPerguntaSecretaRecuperar.txtSenhaNova))['hash'];
        ue.codSenhaBloqueada = 0;
        ue.codPerSctBloqueada = 0;
        ue.codSenhaIncorreta = 0;
        ue.codTentativaPergunta = 0;
        const ueUpdate = await this.fnUsuarioExternoUpdate(ue);
        if (!ueUpdate) {
            return this.fnMensagemOperacaoRealizada();
        }
    }

    private fnMensagemOperacaoRealizada() {
        return ApiResponse.handler({
            codNumber: 40
        });
    }

    private async fnUsuarioExternoUpdate(ue: UsuarioExterno) {
        const ueUpdate = await this.utilRepository.update(UsuarioExterno, {codUsuarioExterno: ue.codUsuarioExterno}, ue);
        return ueUpdate
    }

    private async fnDadosNaoConferemException(ue: UsuarioExterno, usuarioExternoSenhaPerguntaSecretaRecuperar: UsuarioExternoSenhaPerguntaSecretaRecuperar){
        throw new BadRequestException(ApiResponse.handler({
            codNumber: 47,
            input: usuarioExternoSenhaPerguntaSecretaRecuperar,
            outputError: {
                message: "Pergunta secreta bloqueada.",
                context: {
                    input: {
                        codTentativaPergunta: ue.codTentativaPergunta,
                        codInteressado: ue.codInteressado
                    },
                    output: {
                        className: this.className,
                        methodName: 'fnDadosNaoConferemException'
                    }
                }
            }
        }));
    }

    private async bloqueiaPerguntaSecreta(usuarioExterno: UsuarioExterno, usuarioExternoSenhaPerguntaSecretaRecuperar: UsuarioExternoSenhaPerguntaSecretaRecuperar) {
        const ue = new UsuarioExterno(usuarioExterno);
        ue.codTentativaPergunta = usuarioExterno.codTentativaPergunta + 1;
        ue.codPerSctBloqueada = 1;
        const result = await this.fnUsuarioExternoUpdate(ue);
        await this.fnEnviarEmail(usuarioExterno, 'cod_modelo_email_pergunta_secreta_bloqueada');
        if (result) await this.fnDadosNaoConferemException(usuarioExterno, usuarioExternoSenhaPerguntaSecretaRecuperar)
    }

    private async fnEnviarEmail(ue: UsuarioExterno, codModeloEmail: string) {
        const input: ISistemaMensagemFilaCreate['input'] = {
            usuarioExterno: ue,
            codModeloEmail
        };

        await this.sistemaMensagemFilaService.create(input);
    }

    private async fnIncrementaTentativasErradas(usuarioExterno: UsuarioExterno) {
        try {
            const ue = new UsuarioExterno();
            ue.codInteressado = usuarioExterno.codInteressado;
            ue.codUsuarioExterno = usuarioExterno.codUsuarioExterno;
            ue.txtNome = usuarioExterno.txtNome;
            ue.txtRazaoSocial = usuarioExterno.txtRazaoSocial;
            ue.txtEmail = usuarioExterno.txtEmail;
            if (usuarioExterno.codTentativaPergunta <= 6) {
                ue.codTentativaPergunta = usuarioExterno.codTentativaPergunta + 1;
                const result = await this.fnUsuarioExternoUpdate(ue)
                if(result) return result            
            }
        } catch (error) {
            throw new BadRequestException(ApiResponse.handler({
                codNumber: 60,
                outputError: error
            }))
        }
    }

    private sePerguntaInformadaForDiferente(usuarioExterno: UsuarioExterno, usuarioExternoSenhaPerguntaSecretaRecuperar: UsuarioExternoSenhaPerguntaSecretaRecuperar) {
        return (usuarioExterno.codPerguntaSecreta != usuarioExternoSenhaPerguntaSecretaRecuperar.codPerguntaSecreta) ||
        ((usuarioExterno.txtResposta != usuarioExternoSenhaPerguntaSecretaRecuperar.txtRespostaSecreta))
    }

    private fnSePergSecrBloqueada(usuarioExterno: UsuarioExterno) {
        if (usuarioExterno.codPerSctBloqueada === 1) {
            throw new BadRequestException(ApiResponse.handler({
                codNumber: 48,
                outputError: {
                    message: 'Bloqueio por quantidade de tentativas de validação de pergunta secreta incorretas superior a 6.'
                }
            }));
        }
    }

    private fnThrowSeCodAtivo(obj: unknown & { codAtivo: number; }): void {
        if (!obj.codAtivo) {
            throw new BadRequestException(ApiResponse.handler({
                codNumber: 45,
            }));
        }
    }
}