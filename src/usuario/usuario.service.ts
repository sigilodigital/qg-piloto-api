import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { RunnerTransaction } from '@libs/common/databases/runner-transaction/runner-transaction';
import { UsuarioEntity } from './models/entities/usuario.entity';
import { CodigoAcaoEnum } from '@libs/common/enumerations/codigo-acao.enum';
import { UsuarioRepository } from './repositories/usuario-repository';
import { IHistoricoDadosPrimarios } from '@libs/auditoria/models/dto/auditoria-event-list.dto';
import { OrigemEnum } from '@libs/common/enumerations/origem.enum';
import { UsuarioConsultarInputDto, UsuarioConsultarOutputDto } from './models/dto/usuario-consultar.dto';
import { UsuarioIncluirUseCase } from './usecases/usuario-incluir.usecase';
import { UsuarioConsultarUseCase } from './usecases/usuario-consultar.usecase';
import { UtilRepository } from '@libs/common/repository/util.repository';
import { UsuarioIncluirInputDto, UsuarioIncluirOutputDto } from './models/dto/usuario-incluir/usuario-incluir.dto';
import { ContatoEntity } from './models/entities/contato.entity';
import { EmailEntity } from './models/entities/email.entity';
import { TelefoneEntity } from './models/entities/telefone.entity';
import { EnderecoEntity } from './models/entities/endereco.entity';
import { LoginInfoEntity } from './models/entities/login-info.entity';
import { DataAccessEntity } from './models/entities/data-access.entity';
import { ProfileEntity } from './models/entities/profile.entity';

@Injectable()
export class UsuarioService {

    async usuarioIncluir(input: UsuarioIncluirInputDto, request: Request): Promise<UsuarioIncluirOutputDto> {

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