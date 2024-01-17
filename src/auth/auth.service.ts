import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

import { UtilRepository } from '@libs/common/repository/util.repository';
import { ApiResponse, IAPIResponse } from '@libs/common/services/response-handler';
import { InteressadoEntity } from 'src/interessado/entities/interessado.entity';
import { InteressadoService } from 'src/interessado/interessado.service';
import { decrypt } from 'src/shared/utils';
import { SistemaMetodoDto } from 'src/sistema-ws/dto/sistemaMetodoWs.dto';
import { ISistemaMensagemFilaCreate, SistemaMensagemFilaService } from './../sistema-mensagem-fila/sistema-mensagem-fila.service';
import { UsuarioExterno } from './../usuario-externo/entities/usuario-externo.entity';
import { UsuarioExternoService } from './../usuario-externo/usuario-externo.service';
import { ILoginPessoa } from './dto/loginUser.dto';
import { SegSistemaWs } from './entities/segSistemaWs';

@Injectable()
export class AuthService implements IAuthService {

    className = "AuthService";

    private utilRepository:UtilRepository
    private entityList: EntityClassOrSchema[];

    constructor(
        private jwtService: JwtService,
        private interessadoService: InteressadoService,
        private usuarioExternoService: UsuarioExternoService,
        private sistemaMensagemFilaService: SistemaMensagemFilaService
    ) {
        this.entityList = [SegSistemaWs, SistemaMetodoDto, UsuarioExterno]
        this.utilRepository = new UtilRepository()
    }
    sistema: ISistema;
    pessoa: any;
    sistemaMetodo: ISistemaMetodo[];
    codInteressado: number;
    txtInteressado: string;

    async validarSistema(input: ILoginSistema['input']): Promise<IAPIResponse<ILoginSistema['output']>> {
        await this.utilRepository.init(this.entityList);
        const methodName = "AuthService.validarSistema";

        const sistema = await this.utilRepository.findOne(SegSistemaWs, { txtLogin: input.txtLogin });
        await fnSeSistemaAusenteException(sistema);
        fnSeSistemaInativoException(sistema);

        const seSenhaConfere = (await decrypt(input.txtSenha, sistema.txtSenha));
        await fnSeSenhaNaoConfereException(seSenhaConfere);
        delete sistema.txtSenha;

        const sistemaMetodoList = await this.utilRepository.findBy(SistemaMetodoDto, { codSegSistemaWs: sistema.codSegSistemaWs });

        return ApiResponse.handler({ codNumber: 15, output: { sistema, sistemaMetodoList } });

        async function fnSeSenhaNaoConfereException(seSenha: boolean): Promise<void> {
            if (!seSenha)
                throw new ForbiddenException(ApiResponse.handler({
                    codNumber: 6,
                    outputError: {
                        message: 'Senha não confere.',
                        context: {
                            input: input,
                            output: { methodName, }
                        }
                    }
                }));
        }

        async function fnSeSistemaAusenteException(sistema: ISistema): Promise<void> {
            if (!sistema)
                throw new ForbiddenException(ApiResponse.handler({
                    codNumber: 5,
                    input: input,
                    outputError: {
                        message: 'Sistema não encontrado',
                        context: {
                            input: input,
                            output: { methodName, }
                        }
                    }
                }));
        }

        function fnSeSistemaInativoException(sistema: ISistema) {
            if (sistema.codAtivo === 0) {
                throw new ForbiddenException(ApiResponse.handler({
                    codNumber: 7,
                    input: input,
                    outputError: {
                        message: 'Sistema está inativo.',
                        context: {
                            input: input,
                            output: { methodName, }
                        }
                    }
                }));
            }
        }
    }

    async validarUsuario(input: ILoginPessoa['input']): Promise<IAPIResponse<ILoginPessoa['output']>> {
        await this.utilRepository.init(this.entityList);
        const methodName = "AuthService.validarUsuario";

        const interessado = await this.interessadoService.findOneByCnpjCpf(input.txtCnpjCpf);
        await fnSeInteressadoAusenteException(interessado, input);

        const usuarioExterno = await this.utilRepository.findOne(UsuarioExterno, { codInteressado: interessado.codInteressado });
        await fnSeUsuarioAusenteException(usuarioExterno, interessado);
        await fnSeUsuarioInativoException(usuarioExterno);
        await fnSeUsuarioTentativasExcedidasException(usuarioExterno);
        await fnSeUsuarioSenhaNaoCadastradaException(usuarioExterno);

        const seSenhaOk = (await decrypt(input.txtSenha, usuarioExterno.txtSenha));
        await fnSeSenhaNaoConfere(this, seSenhaOk, usuarioExterno, interessado);

        // * zerar campos de controle de quantidade de erros
        this.zerarContadores(usuarioExterno.codInteressado, usuarioExterno.codUsuarioExterno);
        // this.codInteressado = usuarioExterno.codInteressado;
        const usuarioAutenticado = fnUsuarioAutenticadoDto(usuarioExterno, interessado);

        const result = await fnSeSenhaExigirAlteracao(usuarioExterno, usuarioAutenticado)
        || ApiResponse.handler({ codNumber: 46, output: usuarioAutenticado });
        return result;

        function fnUsuarioAutenticadoDto(usuarioExterno: UsuarioExterno, interessado: InteressadoEntity): ILoginPessoa['output'] {
            return {
                codUsuarioExterno: usuarioExterno.codUsuarioExterno,
                codInteressado: interessado.codInteressado,
                txtInteressado: interessado.txtInteressado,
                txtCnpjCpf: interessado.txtCnpjCpf,
            };
        }

        async function fnSeSenhaExigirAlteracao(usuarioExterno, usuarioAutenticado: ILoginPessoa['output']): Promise<IAPIResponse<ILoginPessoa['output']>> {
            if (usuarioExterno.codSenhaAlterada === 1) {
                return ApiResponse.handler({
                    codNumber: 44,
                    output: usuarioAutenticado
                });
            }
        }

        async function fnSeSenhaNaoConfere(thiss: AuthService, seSenhaOk: boolean, usuarioExterno: UsuarioExterno, interessado: InteressadoEntity): Promise<void> {
            if (!seSenhaOk)
                if (usuarioExterno.codSenhaIncorreta <= 6)
                    await thiss.incrementarContadores(interessado.codInteressado, usuarioExterno.codUsuarioExterno);

            fnSeSenhaBloqueadaException();
        }

        function fnSeSenhaBloqueadaException() {
            if (usuarioExterno.codSenhaBloqueada === 1) {
                throw new ForbiddenException(ApiResponse.handler({
                    codNumber: 42,
                    input: input,
                    outputError: {
                        message: 'Número de tentativas erradas superior a 6, senha bloqueada.',
                        context: {
                            output: {
                                methodName: methodName,
                                objectErro: {
                                    codUsuarioExterno: usuarioExterno.codUsuarioExterno,
                                    codInteressado: usuarioExterno.codInteressado,
                                    codSenhaBloqueada: usuarioExterno.codSenhaBloqueada
                                }
                            }
                        }
                    }
                }));
            }
        }

        async function fnSeInteressadoAusenteException(interessado: InteressadoEntity, input: ILoginPessoa['input']) {
            if (!interessado)
                throw new BadRequestException(ApiResponse.handler({
                    codNumber: 16,
                    input: input,
                    outputError: {
                        message: 'Não foi encontrado dados do interessado'
                    }
                }));
        }

        async function fnSeUsuarioAusenteException(usuarioExterno: UsuarioExterno, interessado: InteressadoEntity) {
            if (!usuarioExterno)
                throw new BadRequestException(ApiResponse.handler({
                    codNumber: 9,
                    outputError: {
                        message: 'Usuário externo inexistente!',
                        context: {
                            input: {
                                codInteressado: interessado.codInteressado,
                                txtInteressado: interessado.txtInteressado
                            }
                        }
                    }
                }));
        }

        async function fnSeUsuarioSenhaNaoCadastradaException(usuarioExterno: UsuarioExterno) {
            if (!usuarioExterno.txtSenha) {
                throw new BadRequestException(ApiResponse.handler({
                    codNumber: 47,
                    input: input,
                    outputError: {
                        message: 'Dados não conferem, usuário externo com senha em branco!',
                        context: {
                            input: {
                                codUsuarioExterno: usuarioExterno.codUsuarioExterno,
                                codInteressado: usuarioExterno.codInteressado,
                                codSenhaIncorreta: usuarioExterno.codSenhaIncorreta + 1
                            }
                        }
                    }
                }));
            }
        }

        async function fnSeUsuarioTentativasExcedidasException(usuarioExterno: UsuarioExterno) {
            if (usuarioExterno.codSenhaBloqueada == 1) {
                throw new BadRequestException(ApiResponse.handler({
                    codNumber: 42,
                    outputError: {
                        message: "Número de tentativas erradas superior a 6, senha bloqueada.",
                        context: {
                            input: {
                                codUsuarioExterno: usuarioExterno.codUsuarioExterno,
                                codInteressado: usuarioExterno.codInteressado,
                                codSenhaIncorreta: usuarioExterno.codSenhaIncorreta + 1
                            }
                        }
                    }
                }));
            }
        }

        async function fnSeUsuarioInativoException(usuarioExterno: UsuarioExterno) {
            if (usuarioExterno.codAtivo == 0) {
                throw new BadRequestException(ApiResponse.handler({
                    codNumber: 45,
                    outputError: {
                        message: "Usuário externo está inativo.",
                        context: {
                            input: {
                                codUsuarioExterno: usuarioExterno.codUsuarioExterno,
                                codInteressado: usuarioExterno.codInteressado,
                                codAtivo: usuarioExterno.codAtivo
                            }
                        }
                    }
                }));
            }
        }
    }

    async tokenSystemGenerate(sistema: ILoginPessoa['output']): Promise<string> {
        const payload = { systemDataLogin: sistema };
        const token = this.jwtService.sign(payload);
        return token;
    }

    async tokenUserGenerate(user: ILoginPessoa['output']): Promise<string> {
        const payload = { userDataLogin: user };
        const token = this.jwtService.sign(payload);
        return token;
    }

    async zerarContadores(codInteressado: number, codUsuarioExterno: number) {
        const ue = new UsuarioExterno();
        ue.codInteressado = codInteressado;
        ue.codUsuarioExterno = codUsuarioExterno;
        ue.codSenhaBloqueada = 0;
        ue.codPerSctBloqueada = 0;
        ue.codSenhaIncorreta = 0;
        ue.codTentativaPergunta = 0;
        return this.usuarioExternoService.update(ue);
    }

    async incrementarContadores(codInteressado: number, codUsuarioExterno: number): Promise<UsuarioExterno> {
        const usuarioExternoPesquisa = await this.utilRepository.findOne(UsuarioExterno, { codInteressado: codInteressado });
        const usuarioExternoUpdate = new UsuarioExterno();
        usuarioExternoUpdate.codInteressado = codInteressado;
        usuarioExternoUpdate.codUsuarioExterno = codUsuarioExterno;
        usuarioExternoUpdate.codSenhaIncorreta = usuarioExternoPesquisa.codSenhaIncorreta + 1;

        if (usuarioExternoUpdate.codSenhaIncorreta > 6) {
            usuarioExternoUpdate.codSenhaBloqueada = 1;
            this.enviarEmailSenhaBloqueada(usuarioExternoPesquisa);
        }

        this.usuarioExternoService.update(usuarioExternoUpdate);

        throw new BadRequestException(ApiResponse.handler({
            codNumber: 47,
            input: { codInteressado: codInteressado, codUsuarioExterno: codUsuarioExterno },
            outputError: {
                message: "Senha incorreta.",
                context: {
                    input: {
                        codUsuarioExterno: usuarioExternoPesquisa.codUsuarioExterno,
                        codInteressado: usuarioExternoPesquisa.codInteressado,
                        codSenhaIncorreta: usuarioExternoPesquisa.codSenhaIncorreta
                    },
                    output: {
                        className: this.className,
                        methodName: "async incrementarContadores(codInteressado: number, codUsuarioExterno: number): Promise<UsuarioExterno>"
                    }
                }
            }
        }));

    }

    async enviarEmailSenhaBloqueada(usuarioExterno) {

        const input: ISistemaMensagemFilaCreate['input'] = {
            usuarioExterno: usuarioExterno,
            codModeloEmail: 'cod_modelo_email_senha_bloqueada'
        };

        this.sistemaMensagemFilaService.create(input);
    }
}

interface IAuthService {
    validarSistema(input: ILoginSistema['input']): Promise<IAPIResponse<ILoginSistema['output']>>;
    validarUsuario(input: ILoginPessoa['input']): Promise<IAPIResponse<ILoginPessoa['output']>>;
}

export interface ILoginSistema {
    input: {
        txtLogin: string,
        txtSenha: string;
    },
    output: {
        sistema: ISistema,
        sistemaMetodoList: ISistemaMetodo[];
    };
}

export interface ISistemaMetodo {
    codSegSistemaWs: number,
    codSegMetodoWs: number;
}

export interface ISistema {
    codSegSistemaWs: number,
    txtSegSistemaWs: string,
    txtLogin: string,
    txtDescricao: string,
    codAtivo: number;
}

// export interface ILoginPessoaFisica {
//     input: {
//         txtCnpjCpf: string,
//         txtSenha: string;
//     },
//     output: {
//         codInteressado: number,
//         txtInteressado: string,
//     };
// }

// export interface ILoginPessoaJuridica {
//     input: {
//         txtCnpjCpf: string,
//         txtSenha: string;
//     },
//     output: {
//         codInteressado: number,
//         txtNomeFantasia: string,
//     };
// }
