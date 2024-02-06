import { UtilRepository } from "@libs/common/repository/util.repository";
import { ApiResponse } from "@libs/common/services/response-handler";
import { BadRequestException } from "@nestjs/common";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { InteressadoEntity } from "src/interessado/entities/interessado.entity";
import { decrypt } from "src/shared/utils";
import { SegConfiguracao } from "src/sistema-mensagem-fila/dto/configuracao.dto";
import { ISistemaMensagemFilaCreate, SistemaMensagemFilaService } from "src/sistema-mensagem-fila/sistema-mensagem-fila.service";
import { UsuarioExterno } from "src/usuario-externo/entities/usuario-externo.entity";
import { UtilsService } from "src/utils/utils.service";
import { IUsuarioExternoSenhaAlterar } from "../dto/usuario-externo-senha-senha-alterar.dto";

export class UsuarioExternoSenhaAlterarUseCase {
    private className = 'UsuarioExternoSenhaAlterarUseCase';
    private entityList: EntityClassOrSchema[];

    constructor(
        private utilRepository: UtilRepository,
        private utilService: UtilsService,
        private sistemaMensagemFilaService: SistemaMensagemFilaService){
            this.entityList = [InteressadoEntity, UsuarioExterno, SegConfiguracao];
        }

    public async handler(usuarioExternoSenhaAlterar: IUsuarioExternoSenhaAlterar['input']) {
        const result = await this.usuarioExternoSenhaAlterar(usuarioExternoSenhaAlterar);
        return result
    }

    async usuarioExternoSenhaAlterar(usuarioExternoSenhaAlterar: IUsuarioExternoSenhaAlterar['input']) {
        try {
            const interessado = await this.utilRepository.findOne(InteressadoEntity, {  codInteressado: usuarioExternoSenhaAlterar.codInteressado } );
            if (interessado) {
                const usuarioExterno = await this.utilRepository.findOne(UsuarioExterno, {  codInteressado: usuarioExternoSenhaAlterar.codInteressado } );
                if(!usuarioExterno) this.usuarioNaoEncontradoException(usuarioExternoSenhaAlterar);
                this.seSenhaBloqueada(usuarioExternoSenhaAlterar, usuarioExterno);
                return await this.validarSenha(usuarioExternoSenhaAlterar, usuarioExterno);
            } else {
                return this.usuarioNaoEncontradoException(usuarioExternoSenhaAlterar);
            }
        } catch (error) {
            return error.response
        }
    }

    usuarioNaoEncontradoException(usuarioExternoSenhaAlterar: { txtEmail: string; codInteressado: number; txtSenhaAtual: string; txtSenhaNova: string; }) {
        throw new BadRequestException(ApiResponse.handler({ codMessage: 16, input: usuarioExternoSenhaAlterar, output: null }))
    }

    private seSenhaBloqueada(usuarioExternoSenhaAlterar: IUsuarioExternoSenhaAlterar['input'], usuarioExterno: UsuarioExterno) {
        if (usuarioExterno.codSenhaBloqueada == 1) {
            throw new BadRequestException(
                ApiResponse.handler({
                    codMessage: 42,
                    error: {
                        message: "Senha bloqueada por ultrapassar 6 tentativas incorretas de alterar a senha.",
                        context: {
                            input: usuarioExternoSenhaAlterar,
                            output: {
                                className: this.className,
                                methodName: 'seSenhaBloqueada',
                                objectError: usuarioExterno
                            }
                        }
                    }
                })
            ); 
        }
    }

    private async validarSenha(usuarioExternoSenhaAlterar: IUsuarioExternoSenhaAlterar['input'], usuarioExterno: UsuarioExterno) {
        let result:any;
        if (await this.seSenhaConfere(usuarioExternoSenhaAlterar, usuarioExterno)) {
            result = await this.fnAtualizarNovaSenha(usuarioExternoSenhaAlterar, usuarioExterno);    
            return result
        } else {
            result = await this.fnBloqueiaSenhaSeExcederQuantidadeDeTentativas(usuarioExternoSenhaAlterar, usuarioExterno)
            return result;
        }
    }

    private async fnSalvarUsuarioExterno(usuarioExterno: UsuarioExterno) {
        const ueSalvo = await this.utilRepository.update(UsuarioExterno, {codUsuarioExterno: usuarioExterno.codUsuarioExterno}, usuarioExterno);
    
        if (ueSalvo)
            return ApiResponse.handler({ codMessage: 40 });
        else
            return ApiResponse.handler({ codMessage: 43, error: { message: 'Erro ao tentar salvar após bloqueio.' } });
    }
    
    private async seSenhaConfere(usuarioExternoSenhaAlterar: IUsuarioExternoSenhaAlterar['input'], usuarioExterno: UsuarioExterno): Promise<boolean> {
        return await decrypt(usuarioExternoSenhaAlterar.txtSenhaAtual.toString(), usuarioExterno.txtSenha)
    }

    private async fnAtualizarNovaSenha(usuarioExternoSenhaAlterar: IUsuarioExternoSenhaAlterar['input'], usuarioExterno: UsuarioExterno) {
        /**
         * Senha validada.
         * o	Criptografar a nova senha informada.
         * o	Atualizar o registro do usuário externo com a nova senha criptografada e zerar os contadores de 
         * senha e pergunta secreta do usuário externo. Item 1.8.2.
         */
        const ue = new UsuarioExterno(usuarioExterno);
        ue.codUsuarioExterno = usuarioExterno.codUsuarioExterno;
        ue.codInteressado = usuarioExterno.codInteressado;
        ue.txtSenha = (await this.utilService.encryptText(usuarioExternoSenhaAlterar.txtSenhaNova))['hash'];
        ue.codSenhaAlterada = 0;
        ue.codSenhaBloqueada = 0;
        ue.codPerSctBloqueada = 0;
        ue.codSenhaIncorreta = 0;
        ue.codTentativaPergunta = 0;
    
        return await this.fnSalvarUsuarioExterno(ue);
    }

    private async fnBloqueiaSenhaSeExcederQuantidadeDeTentativas(usuarioExternoSenhaAlterar: IUsuarioExternoSenhaAlterar['input'], usuarioExterno: UsuarioExterno) {
        try {
            const ue = new UsuarioExterno();
            ue.codInteressado = usuarioExterno.codInteressado;
            ue.codUsuarioExterno = usuarioExterno.codUsuarioExterno;
        
            if (this.seQuantidadeTentativasMaiorque6(usuarioExterno)) {
                await this.fnIncrementaQuantidadeDeTentativasErradas(ue, usuarioExterno);
            } else {
                await this.fnBloqueiaSenha(ue, usuarioExterno);
            }
        } catch (error) {
            return error.response
        }
        
    }

    private async fnBloqueiaSenha(ue: UsuarioExterno, usuarioExterno: UsuarioExterno) {
        ue.codSenhaBloqueada = 1;
        await this.fnSalvarUsuarioExterno(ue);
        await this.fnEnviarEmail(usuarioExterno);
        this.fnSenhaBloqueadaException(usuarioExterno);
    }

    fnSenhaBloqueadaException(usuarioExterno: UsuarioExterno) {
        throw new BadRequestException(ApiResponse.handler({
                codMessage: 42,
                error: {
                    message: "Senha bloqueada por ultrapassar 6 tentativas incorretas de alterar a senha.",
                    context: {
                        output: {
                            className: this.className,
                            methodName: 'fnBloqueiaSenha',
                            objectError: usuarioExterno
                        }
                    }
                }
            })
        )
    }

    private async fnEnviarEmail(ue: UsuarioExterno) {
        const input: ISistemaMensagemFilaCreate['input'] = {
            usuarioExterno: ue,
            codModeloEmail: 'cod_modelo_email_senha_bloqueada'
        };

        const emailSalvo = await this.sistemaMensagemFilaService.create(input);

        if (emailSalvo)
            return ApiResponse.handler({ codMessage: 40});
        else
            return ApiResponse.handler({ codMessage: 43, error: { message: 'Erro ao tentar registrar envio de e-mail após bloqueio.' } });
    }

    private async fnIncrementaQuantidadeDeTentativasErradas(ue: UsuarioExterno, usuarioExterno: UsuarioExterno) {
        ue.codSenhaIncorreta = usuarioExterno.codSenhaIncorreta + 1;
        await this.fnSalvarUsuarioExterno(ue);
        throw new BadRequestException(ApiResponse.handler({codMessage: 41}))
    }

    private seQuantidadeTentativasMaiorque6(usuarioExterno: UsuarioExterno){
        const quantidadeTentativas = 6;
        return usuarioExterno.codSenhaIncorreta <= quantidadeTentativas 
    }
}




