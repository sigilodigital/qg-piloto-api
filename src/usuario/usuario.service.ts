import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { RunnerTransaction } from '@libs/common/databases/runner-transaction/runner-transaction';
import { IUsuarioIncluirDto } from './models/dto/usuario-incluir.dto';
import { UsuarioEntity } from './models/entities/usuario.entity';
import { CodigoAcaoEnum } from '@libs/common/enumerations/codigo-acao.enum';
import { UsuarioRepository } from './repositories/usuario-repository';
import { IHistoricoDadosPrimarios } from '@libs/auditoria/models/dto/auditoria-event-list.dto';
import { OrigemEnum } from '@libs/common/enumerations/origem.enum';
import { UsuarioConsultarInputDto, UsuarioConsultarOutputDto } from './models/dto/usuario-consultar.dto';
import { UsuarioIncluirUseCase } from './usecases/usuario-incluir.usecase';
import { UsuarioConsultarUseCase } from './usecases/usuario-consultar.usecase';
import { UtilRepository } from '@libs/common/repository/util.repository';

@Injectable()
export class UsuarioService {

    async usuarioIncluir(input: IUsuarioIncluirDto['input'], request: Request): Promise<IUsuarioIncluirDto['output']> {

        const queryRunner = await RunnerTransaction.startTransaction([UsuarioEntity]);
        const historico = { ...(await fnHistoricoDadosPrimarios()), codAcao: CodigoAcaoEnum.USUARIO_INCLUIR };

        queryRunner.data = historico;
        const ucUsuario = new UsuarioIncluirUseCase(new UsuarioRepository());
        const result = await ucUsuario.handle(input);
        queryRunner.data = null;

        await RunnerTransaction.commitTransaction(queryRunner);
        await RunnerTransaction.finalizeTransaction(queryRunner);

        return result;

        async function fnHistoricoDadosPrimarios(): Promise<IHistoricoDadosPrimarios> {
            return {
                codAcao: CodigoAcaoEnum.PADRAO_NAO_POSSUI,
                // TODO: pegar do tokenSystem o codOrigem
                codOrigem: OrigemEnum.PILOTO,
                usuarioId: '0',
                txtEnderecoIp: request.ip,
                txtEnderecoNome: request.hostname
            };
        }
    }

    async usuarioConsultar(input: UsuarioConsultarInputDto): Promise<UsuarioConsultarOutputDto[]> {
        const ucUsuario = new UsuarioConsultarUseCase(new UsuarioRepository());
        const result = await ucUsuario.handle(input);
        return result;
    }

}