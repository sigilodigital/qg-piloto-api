import { IHistoricoDadosPrimarios } from '@libs/auditoria/models/dto/auditoria-event-list.dto';
import { RunnerTransaction } from '@libs/common/databases/runner-transaction/runner-transaction';
import { CodigoAcaoEnum } from '@libs/common/enumerations/codigo-acao.enum';
import { OrigemEnum } from '@libs/common/enumerations/origem.enum';
import { UtilRepository } from '@libs/common/repository/util.repository';
import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { Request } from 'express';
import { IPerguntaSecreta } from 'src/auth/models/dto/perguntaSecreta.dto';
import { ApiResponse, IAPIResponse } from '@libs/common/services/response-handler';
import { SegConfiguracao } from 'src/sistema-mensagem-fila/dto/configuracao.dto';
import { SistemaMensagem } from 'src/sistema-mensagem-fila/dto/sistema-mensagem.dto';
import { SistemaMensagemFilaEmail } from 'src/sistema-mensagem-fila/entities/sistema-mensagem-fila.entity';
import { SistemaMensagemFilaService } from 'src/sistema-mensagem-fila/sistema-mensagem-fila.service';
import { UsuarioExterno } from 'src/usuario-externo/entities/usuario-externo.entity';
import { UtilsService } from 'src/utils/utils.service';
import { DataSource } from 'typeorm';
import { InteressadoEntity } from './../interessado/entities/interessado.entity';
import { UsuarioExternoService } from './../usuario-externo/usuario-externo.service';
import { IUsuarioExternoLembracaSenhaConsultar } from './dto/usuario-externo-lembranca-senha-consultar.dto';
import { IUsuarioExternoSenhaEmailRecuperar } from './dto/usuario-externo-senha-email-recuperar.dto';
import { UsuarioExternoSenhaPerguntaSecretaRecuperar } from './dto/usuario-externo-senha-pergunta-secreta-recuperar.dto';
import { IUsuarioExternoSenhaAlterar } from './dto/usuario-externo-senha-senha-alterar.dto';
import { UsuarioExternoEmailRecuperarUseCase } from './usecases/usuario-externo-email-recuperar.usecase';
import { UsuarioExternoSenhaAlterarUseCase } from './usecases/usuario-externo-senha-alterar.usecase';
import { UsuarioExternoSenhaPerguntaSecretaRecuperarUseCase } from './usecases/usuario-externo-senha-pergunta-secreta-recuperar.usecase';

@Injectable()
export class RecuperacaoSenhaService {
    private className = "RecuperacaoSenhaService";
    private utilRepository: UtilRepository;
    private entityList: EntityClassOrSchema[];

    constructor(
        // private httpService: HttpService,
        private usuarioExternoService: UsuarioExternoService,
        private sistemaMensagemFilaService: SistemaMensagemFilaService,
        private utilService: UtilsService,
        private readonly dataSource: DataSource) { 
            this.entityList = [InteressadoEntity, UsuarioExterno, SegConfiguracao, SistemaMensagem, SistemaMensagemFilaEmail ]
            this.utilRepository = new UtilRepository();
        }
    
    private async fnHistoricoDadosPrimarios(codInteressado,request: Request): Promise<IHistoricoDadosPrimarios> {
        return <IHistoricoDadosPrimarios>{
            // TODO: pegar do tokenSystem o codOrigem
            codOrigem: OrigemEnum.PILOTO,
            codUsuario: 0,
            codInteressado: codInteressado,
            txtEnderecoIp: request.ip,
            txtEnderecoNome: request.hostname
        };
    }

    async usuarioExternoLembrancaSenhaConsultar(usuarioExternoLembracaSenhaConsultar: IUsuarioExternoLembracaSenhaConsultar['input']) {
        const methodName = "usuarioExternoLembrancaSenhaConsultar(usuarioExternoLembracaSenhaConsultar: IUsuarioExternoLembracaSenhaConsultar['input'])";
        await this.utilRepository.init(this.entityList);

        const interessado = await this.utilRepository.findOne(InteressadoEntity, {  codInteressado: usuarioExternoLembracaSenhaConsultar.codInteressado } );
        if (interessado) {
            const usuarioExterno = await this.utilRepository.findOne(UsuarioExterno, {  codInteressado: interessado.codInteressado } );
            if (usuarioExterno) {
                return ApiResponse.handler({
                    codNumber: 15,
                    input: usuarioExternoLembracaSenhaConsultar,
                    output: {
                        codTipoLembrancaSenha: usuarioExterno.codTipoLembranca,
                        codPerguntaSecreta: usuarioExterno.codPerguntaSecreta,
                        txtRespostaPerguntaSecreta: usuarioExterno.txtResposta
                    }
                });
            } else {
                return ApiResponse.handler({
                    codNumber: 9,
                    input: usuarioExternoLembracaSenhaConsultar,
                    outputError: {
                        message: 'Usuário externo não existe',
                        context: {
                            output: {
                                className: this.className,
                                methodName: methodName
                            }
                        }
                    }
                });
            }

        } else {
            return ApiResponse.handler({
                codNumber: 16,
                input: usuarioExternoLembracaSenhaConsultar
            });
        }
    }

    async usuarioExternoSenhaAlterar(usuarioExternoSenhaAlterar: IUsuarioExternoSenhaAlterar['input'], request: Request) {
        const queryRunner = await RunnerTransaction.startTransaction(this.entityList);
        try {
            this.utilRepository = new UtilRepository(queryRunner);
            const historico = { ...(await this.fnHistoricoDadosPrimarios(usuarioExternoSenhaAlterar.codInteressado, request)), codAcao: CodigoAcaoEnum.USUARIO_EXTERNO_ALTERAR };
            
            queryRunner.data = historico;
    
            await this.utilRepository.init(this.entityList);
             
            const uesaUseCase = new UsuarioExternoSenhaAlterarUseCase(
                new UtilRepository(), 
                new UtilsService(),
                new SistemaMensagemFilaService(new UtilRepository(queryRunner))
                );
            const result = await uesaUseCase.handler(usuarioExternoSenhaAlterar); 
            
            await RunnerTransaction.commitTransaction(queryRunner);
            await RunnerTransaction.finalizeTransaction(queryRunner);
            return result;
        } catch (error) {
            await RunnerTransaction.rollbackTransaction(queryRunner);
            return error.response;
        }
    }

    async usuarioExternoSenhaEmailRecuperar(usuarioExternoSenhaEmailRecuperar: IUsuarioExternoSenhaEmailRecuperar['input'], request: Request) {

        const queryRunner = await RunnerTransaction.startTransaction(this.entityList);
        try {
            this.utilRepository = new UtilRepository(queryRunner);
            const interessado = await this.utilRepository.findOne(InteressadoEntity, {  txtCnpjCpf: usuarioExternoSenhaEmailRecuperar.txtCnpjCpf } );
            this.seInteressadoEncontrado(usuarioExternoSenhaEmailRecuperar, interessado)
            const historico = { ...(await this.fnHistoricoDadosPrimarios(interessado.codInteressado, request)), codAcao: CodigoAcaoEnum.USUARIO_EXTERNO_ALTERAR };
            
            queryRunner.data = historico;
    
            this.utilRepository.init(this.entityList);

            const ueserUseCase = new UsuarioExternoEmailRecuperarUseCase(
                this.utilRepository,
                new UtilsService(),
                new SistemaMensagemFilaService(this.utilRepository)
                );
            const result = await ueserUseCase.handler(usuarioExternoSenhaEmailRecuperar, request, interessado);

            await RunnerTransaction.commitTransaction(queryRunner);
            await RunnerTransaction.finalizeTransaction(queryRunner);
            return result;
        } catch (error) {
            await RunnerTransaction.rollbackTransaction(queryRunner);
            return error.response;
        }
    }
    seInteressadoEncontrado(usuarioExternoSenhaEmailRecuperar: { txtCnpjCpf: string; txtEmail: string; }, interessado: InteressadoEntity) {
        if(!interessado)
            throw new BadRequestException(ApiResponse.handler({
                codNumber: 16,
                output: interessado,
                property: 'txtCnpjCpf',
                valueArg: usuarioExternoSenhaEmailRecuperar.txtCnpjCpf
            }))
    }

    async usuarioExternoSenhaPerguntaSecretaRecuperar(usuarioExternoSenhaPerguntaSecretaRecuperar: UsuarioExternoSenhaPerguntaSecretaRecuperar, request: Request) {

        const queryRunner = await RunnerTransaction.startTransaction(this.entityList);
        try {
            this.utilRepository = new UtilRepository(queryRunner);
            const interessado = await this.utilRepository.findOne(InteressadoEntity, {  txtCnpjCpf: usuarioExternoSenhaPerguntaSecretaRecuperar.txtCnpjCpf } );
            const historico = { ...(await this.fnHistoricoDadosPrimarios(interessado.codInteressado, request)), codAcao: CodigoAcaoEnum.USUARIO_EXTERNO_ALTERAR };
            
            queryRunner.data = historico;
    
            await this.utilRepository.init(this.entityList);

            const uespsrUseCase = new UsuarioExternoSenhaPerguntaSecretaRecuperarUseCase(
                this.utilRepository,
                new UtilsService(),
                new SistemaMensagemFilaService(this.utilRepository)
            );
            const result = await uespsrUseCase.handler(usuarioExternoSenhaPerguntaSecretaRecuperar);

            await RunnerTransaction.commitTransaction(queryRunner);
            await RunnerTransaction.finalizeTransaction(queryRunner);
            return result;
        } catch (error) {
            await RunnerTransaction.rollbackTransaction(queryRunner);
            return error.response;
        }
    }

    async usuarioExternoLembrancaSenhaAlterar(input: IPerguntaSecreta['input'], request: Request): Promise<IAPIResponse<IPerguntaSecreta['output']>> {
        
        const queryRunner = await RunnerTransaction.startTransaction([UsuarioExterno]);
        this.utilRepository = new UtilRepository(queryRunner);
        const historico = { ...(await fnHistoricoDadosPrimarios()), codAcao: CodigoAcaoEnum.USUARIO_EXTERNO_ALTERAR };
        
        queryRunner.data = historico;

        const userExtern = await this.usuarioExternoService.findOne(input.codInteressado);
        if (userExtern) {
            const usuarioExterno = new UsuarioExterno();
            usuarioExterno.codUsuarioExterno = userExtern.codUsuarioExterno;
            usuarioExterno.codTipoLembranca = input.codTipoLembrancaSenha;
            usuarioExterno.codPerguntaSecreta = input.codPerguntaSecreta;
            usuarioExterno.txtResposta = input.txtRespostaPerguntaSecreta;
            const usuarioExternoUpdate = await this.utilRepository.update(UsuarioExterno, {codUsuarioExterno: usuarioExterno.codUsuarioExterno},usuarioExterno);
            await RunnerTransaction.commitTransaction(queryRunner);
            await RunnerTransaction.finalizeTransaction(queryRunner);
            
            if (usuarioExternoUpdate) {
                return ApiResponse.handler({
                    codNumber: 40
                });
            }

        } else {
            RunnerTransaction.rollbackTransaction(queryRunner); 
            return ApiResponse.handler({
                codNumber: 16
            });
        }

        async function fnHistoricoDadosPrimarios(): Promise<IHistoricoDadosPrimarios> {
            return <IHistoricoDadosPrimarios>{
                // TODO: pegar do tokenSystem o codOrigem
                codOrigem: OrigemEnum.PILOTO,
                codUsuario: 0,
                codInteressado: input.codInteressado,
                txtEnderecoIp: request.ip,
                txtEnderecoNome: request.hostname
            };
        }
    }

    gerarNovaSenha() {
        return this.utilService.codigoVerificacaoGerar('#Ik2');
    }



}

/**
 * @description Função que gera uma exceção caso a propriedade codAtivo seja igual a 0
 * @param obj Objeto que será usado para verificar se sua prorpriedade codAtivo possui o valor = 1
 */
function fnTrhowSeCodAtivo_0(obj: unknown & { codAtivo: number; }): void {
    if (!obj.codAtivo) {
        throw new HttpException(ApiResponse.handler({
            codNumber: 45,
        }), HttpStatus.FORBIDDEN);
    }
}

