import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { IAuditDadosPrimarios } from '@libs/audit/models/dto/audit-event-list.dto';
import { RunnerTransaction } from '@libs/common/databases/runner-transaction/runner-transaction';
import { CodigoAcaoEnum } from '@sd-root/libs/common/src/models/enumerations/codigo-acao.enum';
import { OrigemEnum } from '@sd-root/libs/common/src/models/enumerations/origem.enum';
import { ApiResponse } from '@libs/common/services/api-response';
import { AvaliadorConsultarInputDto, AvaliadorConsultarOutputDto } from './models/dto/avaliador-consultar/avaliador-consultar.dto';
import { AvaliadorIncluirInputDto, AvaliadorIncluirOutputDto } from './models/dto/avaliador-incluir/avaliador-incluir.dto';
import { AvaliadorEntity } from './models/entities/avaliador.entity';
import { AvaliadorRepository } from './repositories/avaliador.repository';
import { AvaliadorConsultarUseCase } from './usecases/avaliador-consultar.usecase';
import { AvaliadorIncluirUseCase } from './usecases/avaliador-incluir.usecase';

@Injectable()
export class AvaliadorService {

    async avaliadorIncluir(input: AvaliadorIncluirInputDto, request: Request): Promise<AvaliadorIncluirOutputDto> {

        const queryRunner = await RunnerTransaction.startTransaction([AvaliadorEntity]);
        const historico = { ...(await fnHistoricoDadosPrimarios()), codAcao: CodigoAcaoEnum.AVALIADOR_INCLUIR };

        queryRunner.data = historico;
        const ucAvaliador = new AvaliadorIncluirUseCase(new AvaliadorRepository(), new ApiResponse());
        const result = await ucAvaliador.handle(input);
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

    async avaliadorConsultar(input: AvaliadorConsultarInputDto): Promise<AvaliadorConsultarOutputDto[]> {
        const ucAvaliador = new AvaliadorConsultarUseCase(new AvaliadorRepository());
        const result = await ucAvaliador.handle(input);
        return result;
    }

}