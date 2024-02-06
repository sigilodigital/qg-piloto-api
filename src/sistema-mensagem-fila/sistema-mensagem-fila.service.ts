import { UtilRepository } from '@libs/common/repository/util.repository';
import { Injectable } from '@nestjs/common';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { ApiResponse } from '@libs/common/services/response-handler';
import { UsuarioExterno } from 'src/usuario-externo/entities/usuario-externo.entity';
import { SegConfiguracao } from './dto/configuracao.dto';
import { SistemaMensagem } from './dto/sistema-mensagem.dto';
import { SistemaMensagemFilaEmail } from './entities/sistema-mensagem-fila.entity';

export interface ISistemaMensagemFilaCreate {
    input: {
        usuarioExterno: UsuarioExterno,
        codModeloEmail: string,
        textoModificarList?: {
            alvo: string;
            value: string;
        }[];
    };
}

@Injectable()
export class SistemaMensagemFilaService {
    private className = "SistemaMensagemFilaService";
    private entityList: EntityClassOrSchema[];
    
    constructor(
        private utilRepository: UtilRepository
        ) {
            this.entityList = [SistemaMensagemFilaEmail, SegConfiguracao, SistemaMensagem, SistemaMensagemFilaEmail]
         }
    async create(input: ISistemaMensagemFilaCreate['input']): Promise<ApiResponse> {
        const methodName = "async create(input: ISistemaMensagemFilaCreate['input']): Promise<ApiResponse>";

        const sistemaMensagemFilaEmail = new SistemaMensagemFilaEmail();
        sistemaMensagemFilaEmail.txtPara = `${input.usuarioExterno.txtNome || input.usuarioExterno.txtRazaoSocial} <${input.usuarioExterno.txtEmail}>`;
        sistemaMensagemFilaEmail.txtConfig = input.codModeloEmail;

        const configuracao = await this.getConfiguracaoValor(sistemaMensagemFilaEmail.txtConfig);
        if (configuracao) {
            const sistemaMensagem = await this.getModeloMensagem(<number><unknown>configuracao.txtValorPadrao);
            sistemaMensagemFilaEmail.txtAssunto = sistemaMensagem.txtTitulo;
            if (input.textoModificarList) {
                sistemaMensagemFilaEmail.txtMensagem = this.modeloMensagemAtualizar(sistemaMensagem.txtMensagem, input.textoModificarList);
            } else {
                sistemaMensagemFilaEmail.txtMensagem = sistemaMensagem.txtMensagem;
            }
            sistemaMensagemFilaEmail.codEnviado = 0;
            sistemaMensagemFilaEmail.txtDe = `${sistemaMensagem.txtRemetente} <${sistemaMensagem.txtRemetenteEmail}>`;
            sistemaMensagemFilaEmail.codMensagemTipo = <number><unknown>configuracao.txtValorPadrao;
            return await this.salvarMensagem(sistemaMensagemFilaEmail);
        } else {
            return ApiResponse.handler({
                codMessage: 16,
                input: sistemaMensagemFilaEmail,
                output: null,
                error: {
                    message: `Configuração de modelo de email não encontrado! ${{ txtConfiguracao: sistemaMensagemFilaEmail.txtConfig }}`,
                    context: {
                        input: input,
                        output: {
                            className: this.className,
                            methodName: methodName
                        }
                    }
                }
            });
        }
    }

    async salvarMensagem(sistemaMensagemFilaEmail) {
        return this.utilRepository.save(sistemaMensagemFilaEmail, 'codMensagem','S_TBL_SISTEMA_MENSAGEM_FILA');
    }

    getConfiguracaoValor(txtConfiguracao: string) {
        return this.utilRepository.findOne(SegConfiguracao, { txtConfiguracao } );
    }

    getModeloMensagem(codMensagem: number) {
        return this.utilRepository.findOne(SistemaMensagem, { codMensagem });
    }

    modeloMensagemAtualizar(modeloMensagem: string, textoModificarList: ISistemaMensagemFilaCreate['input']['textoModificarList']) {
        textoModificarList.forEach((e, i, l) => {
            modeloMensagem = modeloMensagem.replace(textoModificarList[i].alvo, textoModificarList[i].value);
        });
        return modeloMensagem;
    }
}