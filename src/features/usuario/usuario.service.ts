import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { IAuditDadosPrimarios } from '@libs/audit/models/dto/audit-event-list.dto';
import { RunnerTransaction } from '@libs/common/databases/runner-transaction/runner-transaction';
import { CodigoAcaoEnum } from '@sd-root/libs/common/src/models/enumerations/codigo-acao.enum';
import { OrigemEnum } from '@sd-root/libs/common/src/models/enumerations/origem.enum';
import { ApiResponse } from '@libs/common/services/api-response';
import { UsuarioConsultarInputDto, UsuarioConsultarOutputDto } from './models/dto/usuario-consultar.dto';
import { UsuarioIncluirInputDto, UsuarioIncluirOutputDto } from './models/dto/usuario-incluir/usuario-incluir.dto';
import { UsuarioEntity } from './models/entities/usuario.entity';
import { UsuarioRepository } from './repositories/usuario.repository';
import { UsuarioConsultarUseCase } from './usecases/usuario-consultar.usecase';
import { UsuarioIncluirUseCase } from './usecases/usuario-incluir.usecase';

@Injectable()
export class UsuarioService {

    async usuarioIncluir(input: UsuarioIncluirInputDto, request: Request): Promise<UsuarioIncluirOutputDto> {

        const queryRunner = await RunnerTransaction.startTransaction([UsuarioEntity]);
        const historico = { ...(await fnHistoricoDadosPrimarios()), codAcao: CodigoAcaoEnum.USUARIO_INCLUIR };

        queryRunner.data = historico;
        const ucUsuario = new UsuarioIncluirUseCase(new UsuarioRepository(), new ApiResponse());
        const result = await ucUsuario.handle(input);
        queryRunner.data = null;

        await RunnerTransaction.commitTransaction(queryRunner);
        await RunnerTransaction.finalizeTransaction(queryRunner);

        return result;

        async function fnHistoricoDadosPrimarios(): Promise<IAuditDadosPrimarios> {
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