import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

import { UtilRepository } from '@libs/common/repository/util.repository';
import { ApiResponse } from '@libs/common/services/response-handler-v2';
import { UsuarioEntity } from 'src/usuario/models/entities/usuario.entity';
import { IUsuarioRepository, UsuarioRepository } from 'src/usuario/repositories/usuario-repository';
import { LoginUserInputDto, LoginUserOutputDto } from './models/dto/login-user.dto';
import { LoginSistemaInputDto, LoginSistemaOutputDto } from './models/dto/loginSistema.dto';
import { MetodoEntity } from './models/entities/metodo.entity';
import { SistemaMetodoEntity } from './models/entities/sistema-metodo.entity';
import { SistemaEntity } from './models/entities/sistema.entity';
import { IUtilService, UtilService } from '@libs/common/services/util.service';

interface IAuthService {
    sistemaValidar(input: LoginSistemaInputDto): Promise<LoginSistemaOutputDto>;
    usuarioValidar(input: LoginUserInputDto): Promise<LoginUserOutputDto>;
}

@Injectable()
export class AuthService implements IAuthService {
    readonly LOG_CLASS_NAME = "AuthService";

    private utilRepository: UtilRepository;
    private entityList: EntityClassOrSchema[];

    constructor(
        private apiResponse: ApiResponse<LoginSistemaInputDto, any>,
        private jwtService: JwtService,
        private utilService: UtilService,
        private usuarioRepo: UsuarioRepository
    ) {
        this.entityList = [SistemaEntity, MetodoEntity, SistemaMetodoEntity];
        this.utilRepository = new UtilRepository();
    }

    async sistemaValidar(input: LoginSistemaInputDto): Promise<LoginSistemaOutputDto> {

        await this.utilRepository.init(this.entityList);

        const system = await this.utilRepository.findOne(SistemaEntity, { where: { username: input.username }, relations: { _metodoList: true } });
        // TODO: conferir a propriedade relationLoadStrategy: join|query
        // const system = await this.utilRepository.findOne(SistemaEntity, { where: { username: input.username }, relationLoadStrategy: '' });

        fnThrowSeSistemaAusente(system);
        fnThrowSeSistemaInativo(system);

        await fnSeSistemaSenhaNaoConfere(system, input);

        return systemDto(system);

        function systemDto(system: SistemaEntity): LoginSistemaOutputDto {
            return {
                sistema: system,
                metodoList: system._metodoList
            };
        }

        function fnThrowSeSistemaAusente<C extends AuthService>(system: SistemaEntity, C?: C): void {
            if (!system)
                throw new ForbiddenException(C.apiResponse.handler({
                    codMessage: 0,
                    error: {
                        message: 'Sistema não encontrado.',
                        context: {
                            className: C.LOG_CLASS_NAME,
                            methodName: C.sistemaValidar.name,
                            input: input,
                            output: system
                        }
                    }
                }));
        }

        function fnThrowSeSistemaInativo<C extends AuthService>(sistema: SistemaEntity, C?: C) {
            if (sistema.isActive === false) {
                throw new ForbiddenException(C.apiResponse.handler({
                    codMessage: 0,
                    error: {
                        message: 'Sistema está inativo.',
                        context: {
                            className: C.LOG_CLASS_NAME,
                            methodName: C.sistemaValidar.name,
                            input: input,
                            output: system
                        }
                    }
                }));
            }
        }
        async function fnSeSistemaSenhaNaoConfere<C extends AuthService>(system: SistemaEntity, input: LoginSistemaInputDto, C?: C): Promise<void> {
            if (!(await C.utilService.decrypt(input.password, system.password)))
                throw new ForbiddenException(C.apiResponse.handler({
                    codMessage: 0,
                    error: {
                        message: 'Senha não confere.',
                        context: {
                            className: C.LOG_CLASS_NAME,
                            methodName: C.sistemaValidar.name,
                            input: input,
                            output: system
                        }
                    }
                }));
        }

    }

    async usuarioValidar(input: LoginUserInputDto): Promise<LoginUserOutputDto> {

        const user: UsuarioEntity = await this.usuarioRepo.findOne({ where: { _dataAccess: { username: input.username } }, relations: { _dataAccess: true } });

        await throwSeUsuarioAusente(user, input);
        await throwSeUsuarioInativo(user, input);
        await throwSeUsuarioSenhaNaoCadastrada(user, input);
        await throwSeUsuarioSenhaBloqueada(user, input);
        // await fnSeUsuarioSenhaRequerAlteracao(user, input);
        await fnUsuarioSenhaConferir(user, input);
        await throwSeUsuarioSenhaExcedeuTentativas(user, input);

        fnUsuarioAtualizar_zerarContadorTentativas(user);
        const result = fnUsuarioDto(user);
        return result;

        function fnUsuarioDto(user: UsuarioEntity): LoginUserOutputDto {
            return {
                cpf: user.cpf,
                fullname: user.fullname,
                id: user.id,
                socialName: user.socialName,
                __params: {
                    isPasswordRequireChange: user._dataAccess.isPasswordRequireChange
                }
            };
        }

        async function throwSeUsuarioAusente<C extends AuthService>(user: UsuarioEntity, input: LoginUserInputDto, C?: C) {
            if (!user)
                throw new BadRequestException(C.apiResponse.handler({
                    codMessage: 0,
                    error: {
                        message: 'Usuário não existe!',
                        context: {
                            className: C.LOG_CLASS_NAME,
                            methodName: C.usuarioValidar.name,
                            input: input,
                            output: user
                        }
                    }
                }));
        }

        async function throwSeUsuarioInativo<C extends AuthService>(user: UsuarioEntity, input: LoginUserInputDto, C?: C) {
            if (user.isActive === false) {
                throw new BadRequestException(C.apiResponse.handler({
                    codMessage: 0,
                    error: {
                        message: "Usuário externo está inativo.",
                        context: {
                            className: C.LOG_CLASS_NAME,
                            methodName: C.usuarioValidar.name,
                            input: input,
                            output: user
                        }
                    }
                }));
            }
        }

        async function throwSeUsuarioSenhaNaoCadastrada<C extends AuthService>(user: UsuarioEntity, input: LoginUserInputDto, C?: C) {
            if (!user._dataAccess.passwordHash) {
                throw new BadRequestException(C.apiResponse.handler({
                    codMessage: 0,
                    error: {
                        message: 'Dados não conferem, usuário externo com senha em branco!',
                        context: {
                            className: C.LOG_CLASS_NAME,
                            methodName: C.usuarioValidar.name,
                            input: input,
                            output: user
                        }
                    }
                }));
            }
        }

        function throwSeUsuarioSenhaBloqueada<C extends AuthService>(user: UsuarioEntity, input: LoginUserInputDto, C?: C) {
            if (user._dataAccess.isPasswordLocked === true) {
                throw new ForbiddenException(C.apiResponse.handler({
                    codMessage: 0,
                    error: {
                        // message: 'Número de tentativas erradas superior a 6, senha bloqueada.',
                        message: 'Senha bloqueada.',
                        context: {
                            className: C.LOG_CLASS_NAME,
                            methodName: C.usuarioValidar.name,
                            input: input,
                            output: user
                        }
                    }
                }));
            }
        }

        async function fnSeUsuarioSenhaRequerAlteracao<C extends AuthService>(user: UsuarioEntity, input: LoginUserInputDto, C?: C): Promise<void> {
            if (user._dataAccess.isPasswordRequireChange === true) {
                throw new BadRequestException(C.apiResponse.handler({
                    codMessage: 0,
                    error: {
                        message: 'A conta requer alteração de senha.',
                        context: {
                            className: C.LOG_CLASS_NAME,
                            methodName: C.usuarioValidar.name,
                            input: input,
                            output: user
                        }
                    }
                }));
            }
        }

        async function fnUsuarioSenhaConferir<C extends AuthService>(user: UsuarioEntity, input: LoginUserInputDto, C?: C): Promise<void> {
            if (!(await C.utilService.decrypt(input.password, user._dataAccess.passwordHash)))
                await throwUsuarioSenhaIncrementaContadorErroSenha(user, input);
        }

        async function throwUsuarioSenhaIncrementaContadorErroSenha<C extends AuthService>(user: UsuarioEntity, input: LoginUserInputDto, C?: C): Promise<void> {
            // TODO: incrementar quantidade maxima de erros configurada por parâmetro
            if (++user._dataAccess.passCountErrors >= 5) {
                user._dataAccess.isPasswordLocked = true;

                this.usuarioRepo.update(user);
                // TODO: Enviar e-mail quando a senha for bloqueada
                this.enviarEmailSenhaBloqueada(user);
                throwSeUsuarioSenhaBloqueada(user, input);
            }

            this.usuarioRepo.update(user);

            throwUsuarioSenhaIncorreta(user);
        }

        async function throwUsuarioSenhaIncorreta<C extends AuthService>(user: UsuarioEntity, C?: C): Promise<UsuarioEntity> {
            throw new BadRequestException(C.apiResponse.handler({
                codMessage: 0,
                error: {
                    message: "Senha incorreta.",
                    context: {
                        input: input,
                        output: {
                            className: C.LOG_CLASS_NAME,
                            methodName: C.usuarioValidar.name
                        }
                    }
                }
            }));
        }

        function throwSeUsuarioSenhaExcedeuTentativas<C extends AuthService>(user: UsuarioEntity, input: LoginUserInputDto, C?: C) {
            if (user._dataAccess.passCountErrors >= 5)
                throw new BadRequestException(C.apiResponse.handler({
                    codMessage: 0,
                    error: {
                        message: "Número de tentativas erradas superior ao permitido. Senha bloqueada.",
                        context: {
                            className: C.LOG_CLASS_NAME,
                            methodName: C.usuarioValidar.name,
                            input: input,
                            output: user
                        }
                    }
                }));
        }

        async function fnUsuarioAtualizar_zerarContadorTentativas<C extends AuthService>(user: UsuarioEntity, C?: C) {
            user._dataAccess.passCountErrors = 0;
            C.usuarioRepo.update(user);
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



    async enviarEmailSenhaBloqueada(usuarioExterno) {

        // const input: ISistemaMensagemFilaCreate['input'] = {
        //     usuarioExterno: usuarioExterno,
        //     codModeloEmail: 'cod_modelo_email_senha_bloqueada'
        // };

        // this.sistemaMensagemFilaService.create(input);
    }
}
