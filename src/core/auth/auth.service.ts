import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

import { UtilRepository } from '@libs/common/repository/util.repository';
import { MSG } from '@libs/common/services/code-messages';
import { ApiResponse } from '@libs/common/services/response-handler';
import { UtilService } from '@libs/common/services/util.service';
import { UsuarioRepository } from '@sd-root/src/features/usuario/repositories/usuario.repository';
import { UsuarioEntity } from 'src/features/usuario/models/entities/usuario.entity';
import { LoginUserInputDto, LoginUserOutputDto } from './models/dto/login-user.dto';
import { LoginSistemaInputDto, LoginSistemaOutputDto } from './models/dto/loginSistema.dto';
import { MetodoEntity } from './models/entities/metodo.entity';
import { SistemaEntity } from './models/entities/sistema.entity';

interface IAuthService {
    sistemaValidar(input: LoginSistemaInputDto): Promise<LoginSistemaOutputDto>;
    usuarioValidar(input: LoginUserInputDto): Promise<LoginUserOutputDto>;
}

@Injectable()
export class AuthService implements IAuthService {
    readonly LOG_CLASS_NAME = "AuthService";

    private systemEntityList: EntityClassOrSchema[];

    constructor(
        private apiResponse: ApiResponse<LoginSistemaInputDto, any>,
        private jwtService: JwtService,
        private utilService: UtilService,
        private utilRepository: UtilRepository,
        private usuarioRepository: UsuarioRepository
    ) {
        this.systemEntityList = [SistemaEntity, MetodoEntity/*, SistemaMetodoEntity*/];
    }

    async sistemaValidar(input: LoginSistemaInputDto): Promise<LoginSistemaOutputDto> {

        await this.utilRepository.init(this.systemEntityList);

        const system = <SistemaEntity>await this.utilRepository.findOne({ where: { username: input.username }, relations: { _metodoList: true } }, SistemaEntity);

        fnThrowSeSistemaAusente(system, this);
        fnThrowSeSistemaInativo(system, this);

        await fnSeSistemaSenhaNaoConfere(system, input, this);

        return systemDto(system);

        function systemDto(system: SistemaEntity): LoginSistemaOutputDto {
            return {
                sistema: system,
                metodoList: system._metodoList
            };
        }

        function fnThrowSeSistemaAusente<C extends AuthService>(system: SistemaEntity, C: C): void {
            if (!system)
                throw new ForbiddenException(C.apiResponse.handler({
                    objMessage: MSG.ERR_AUTH_SYS_N_ENCONT,
                    warning: {
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

        function fnThrowSeSistemaInativo<C extends AuthService>(sistema: SistemaEntity, C: C) {
            if (sistema.isActive === false) {
                throw new ForbiddenException(C.apiResponse.handler({
                    objMessage: MSG.ERR_AUTH_SYS_INATIV,
                    warning: {
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

        async function fnSeSistemaSenhaNaoConfere<C extends AuthService>(system: SistemaEntity, input: LoginSistemaInputDto, C: C): Promise<void> {
            if (!(await C.utilService.decrypt(input.password, system.password)))
                throw new ForbiddenException(C.apiResponse.handler({
                    objMessage: MSG.ERR_AUTH_SYS_N_AUTENT,
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

        const user: UsuarioEntity = await this.usuarioRepository.findOne({
            where: { _dataAccess: { username: input.username } },
            relations: { _dataAccess: true }
        });
        // const data: DataAccessEntity = await this.utilRepository.findOne(DataAccessEntity, { where: { username: input.username }, relations: { _usuario: true } });

        await throwSeUsuarioAusente(user, input, this);
        await throwSeUsuarioInativo(user, input, this);
        await throwSeUsuarioSenhaNaoCadastrada(user, input, this);
        await throwSeUsuarioSenhaBloqueada(user, input, this);
        // await fnSeUsuarioSenhaRequerAlteracao(user, input, this);
        await fnUsuarioSenhaConferir(user, input, this);
        await throwSeUsuarioSenhaExcedeuTentativas(user, input, this);

        fnUsuarioAtualizar_zerarContadorTentativas(user, this);
        const result = fnUsuarioDto(user);
        return result;

        function fnUsuarioDto(user: UsuarioEntity): LoginUserOutputDto {
            return {
                cpf: user.cpf,
                fullname: user.fullname,
                id: user.id,
                socialname: user.socialname,
                __params: {
                    isPasswordRequireChange: user._dataAccess.isPasswordRequireChange
                }
            };
        }

        async function throwSeUsuarioAusente<C extends AuthService>(user: UsuarioEntity, input: LoginUserInputDto, C: C) {
            if (!user)
                throw new BadRequestException(C.apiResponse.handler({
                    objMessage: MSG.ERR_AUTH_USR_N_ENCONT,
                    warning: {
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

        async function throwSeUsuarioInativo<C extends AuthService>(user: UsuarioEntity, input: LoginUserInputDto, C: C) {
            if (user.isActive === false) {
                throw new BadRequestException(C.apiResponse.handler({
                    objMessage: MSG.ERR_AUTH_USR_INATIV,
                    warning: {
                        message: "Usuário está inativo.",
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

        async function throwSeUsuarioSenhaNaoCadastrada<C extends AuthService>(user: UsuarioEntity, input: LoginUserInputDto, C: C) {
            if (!user._dataAccess.password) {
                throw new BadRequestException(C.apiResponse.handler({
                    objMessage: MSG.ERR_AUTH_USR_N_AUTENT,
                    error: {
                        message: 'Usuário com senha em branco.',
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

        function throwSeUsuarioSenhaBloqueada<C extends AuthService>(user: UsuarioEntity, input: LoginUserInputDto, C: C) {
            if (user._dataAccess.isPasswordLocked === true) {
                throw new ForbiddenException(C.apiResponse.handler({
                    objMessage: MSG.ERR_AUTH_USR_SENHA_BLOQUEADA,
                    warning: {
                        message: 'A senha do usuário está bloqueada.',
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

        async function fnUsuarioSenhaConferir<C extends AuthService>(user: UsuarioEntity, input: LoginUserInputDto, C: C): Promise<void> {
            if (!(await C.utilService.decrypt(input.password, user._dataAccess.password)))
                await throwUsuarioSenhaIncrementaContadorErroSenha(user, input, C);
        }

        async function throwUsuarioSenhaIncrementaContadorErroSenha<C extends AuthService>(user: UsuarioEntity, input: LoginUserInputDto, C: C): Promise<void> {
            // TODO: incrementar quantidade maxima de erros configurada por parâmetro
            if (++user._dataAccess.passCountErrors >= 5) {
                user._dataAccess.isPasswordLocked = true;

                await C.usuarioRepository.update(user);
                // TODO: Enviar e-mail quando a senha for bloqueada
                // C.enviarEmailSenhaBloqueada(user);
                await throwSeUsuarioSenhaBloqueada(user, input, C);
            }

            C.usuarioRepository.update(user);

            await throwUsuarioSenhaIncorreta(user, C);
        }

        async function throwUsuarioSenhaIncorreta<C extends AuthService>(user: UsuarioEntity, C: C): Promise<UsuarioEntity> {
            throw new BadRequestException(C.apiResponse.handler({
                objMessage: MSG.ERR_AUTH_USR_N_AUTENT,
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

        function throwSeUsuarioSenhaExcedeuTentativas<C extends AuthService>(user: UsuarioEntity, input: LoginUserInputDto, C: C) {
            if (user._dataAccess.passCountErrors >= 5)
                throw new BadRequestException(C.apiResponse.handler({
                    objMessage: MSG.ERR_AUTH_USR_SENHA_BLOQUEADA,
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

        async function fnUsuarioAtualizar_zerarContadorTentativas<C extends AuthService>(user: UsuarioEntity, C: C) {
            const passCountErrors = 1;
            await C.usuarioRepository.update<UsuarioEntity>({ id: user._dataAccess.id }, { _dataAccess: { passCountErrors } });
            // C.utilRepository.update<DataAccessEntity>({ id: user._dataAccess.id }, { passCountErrors }, DataAccessEntity);
        }
    }

    async tokenGenerate(loginData: LoginSistemaOutputDto | LoginUserOutputDto | unknown, options?: { expiresIn?: string; }): Promise<string> {
        const payload = { loginData };
        const token = this.jwtService.sign(payload, options);
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
