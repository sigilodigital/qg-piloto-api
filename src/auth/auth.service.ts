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
import { LoginUserInputDto } from './models/dto/login-user.dto';
import { SistemaEntity } from './models/entities/sistema.entity';
import { SistemaMetodoEntity } from './models/entities/sistema-metodo.entity';
import { LoginSistemaInputDto, LoginSistemaOutputDto } from './models/dto/loginSistema.dto';
import { UsuarioService } from 'src/usuario/usuario.service';
import { UsuarioRepository } from 'src/usuario/repositories/usuario-repository';

@Injectable()
export class AuthService implements IAuthService {

    className = "AuthService";

    private utilRepository: UtilRepository;
    private entityList: EntityClassOrSchema[];

    constructor(
        private jwtService: JwtService,
        private readonly usuarioRepo: UsuarioRepository,
        private interessadoService: InteressadoService,
        private usuarioExternoService: UsuarioExternoService,
        private sistemaMensagemFilaService: SistemaMensagemFilaService
    ) {
        this.entityList = [SistemaEntity, SistemaMetodoDto, UsuarioExterno];
        this.utilRepository = new UtilRepository();
    }
    sistema: SistemaEntity;
    pessoa: any;
    sistemaMetodo: SistemaMetodoEntity[];
    codInteressado: number;
    txtInteressado: string;

    async validarSistema(input: LoginSistemaInputDto): Promise<IAPIResponse<LoginSistemaOutputDto>> {
        await this.utilRepository.init(this.entityList);
        const methodName = "AuthService.validarSistema";

        const sistema = await this.utilRepository.findOne(SistemaEntity, { username: input.username });
        await fnSeSistemaAusenteException(sistema);
        fnSeSistemaInativoException(sistema);

        const seSenhaConfere = (await decrypt(input.password, sistema.password));
        await fnSeSenhaNaoConfereException(seSenhaConfere);
        delete sistema.password;

        const sistemaMetodoList = await this.utilRepository.findBy(SistemaMetodoEntity, { id: sistema.id }); //MODIFICADO

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

        async function fnSeSistemaAusenteException(sistema: SistemaEntity): Promise<void> {
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

        function fnSeSistemaInativoException(sistema: SistemaEntity) {
            if (sistema.seAtivo === false) {
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

    async usuarioValidar(input: LoginUserInputDto): Promise<IAPIResponse<LoginUserInputDto>> {
        const methodName = "AuthService.validarUsuario";

        await this.utilRepository.init(this.entityList);

        const user = await this.usuarioRepo.find({ where: { _dataAccess: { username: input.username } }, relations: { _dataAccess: true } });

        const interessado = await this.interessadoService.findOneByCnpjCpf(input.username);
        await fnSeInteressadoAusenteException(interessado, input);

        const usuarioExterno = await this.utilRepository.findOne(UsuarioExterno, { codInteressado: interessado.codInteressado });
        await fnSeUsuarioAusenteException(usuarioExterno, interessado);
        await fnSeUsuarioInativoException(usuarioExterno);
        await fnSeUsuarioTentativasExcedidasException(usuarioExterno);
        await fnSeUsuarioSenhaNaoCadastradaException(usuarioExterno);

        const seSenhaOk = (await decrypt(input.password, usuarioExterno.txtSenha));
        await fnSeSenhaNaoConfere(this, seSenhaOk, usuarioExterno, interessado);

        // * zerar campos de controle de quantidade de erros
        this.zerarContadores(usuarioExterno.codInteressado, usuarioExterno.codUsuarioExterno);
        // this.codInteressado = usuarioExterno.codInteressado;
        const usuarioAutenticado = fnUsuarioAutenticadoDto(usuarioExterno, interessado);

        const result = await fnSeSenhaExigirAlteracao(usuarioExterno, usuarioAutenticado)
            || ApiResponse.handler({ codNumber: 46, output: usuarioAutenticado });
        return result;

        function fnUsuarioAutenticadoDto(usuarioExterno: UsuarioExterno, interessado: InteressadoEntity) {
            return {
                codUsuarioExterno: usuarioExterno.codUsuarioExterno,
                codInteressado: interessado.codInteressado,
                txtInteressado: interessado.txtInteressado,
                txtCnpjCpf: interessado.txtCnpjCpf,
            };
        }

        async function fnSeSenhaExigirAlteracao(usuarioExterno, usuarioAutenticado: any): Promise<IAPIResponse<any>> {
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

        async function fnSeInteressadoAusenteException(interessado: InteressadoEntity, input: any) {
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

    async tokenSystemGenerate(sistema: any): Promise<string> {
        const payload = { systemDataLogin: sistema };
        const token = this.jwtService.sign(payload);
        return token;
    }

    async tokenUserGenerate(user: any): Promise<string> {
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
    validarSistema(input: LoginSistemaInputDto): Promise<IAPIResponse<LoginSistemaOutputDto>>;
    usuarioValidar(input: LoginUserInputDto): Promise<IAPIResponse<any>>;
}