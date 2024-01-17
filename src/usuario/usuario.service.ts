import { Injectable } from '@nestjs/common';
import { Request } from 'express';

// import { UtilRepository } from '@libs/common/repository/util.repository';
// import { UsuarioExterno } from 'src/segusuario-externo/models/entities/segusuarioexterno.entity';
// import { CodigoAcaoEnum } from 'src/shared/models/enum/codigo-acao.enum';
// import { OrigemEnum } from 'src/shared/models/enum/origem.enum';
// import { IHistoricoDadosPrimarios } from 'src/sistema-historico/models/dto/sistema-historico-event-list.dto';
// import { ArquivosService } from '../../arquivos/arquivos.service';
// import { EmailService } from '../../email/email.service';
// import { InteressadoRepository } from '../../interessado/repository/interessado-repository';
// import { UsuarioExternoRepository } from '../../segusuario-externo/repository/usuario-externo-repository';
// import { IUsuarioConsultarDto } from './dto/usuario-consultar.dto';
// import { IUsuarioIncluirDto } from './dto/usuario-incluir.dto';
// import { UsuarioEntity } from './entities/usuario.entity';
// import { UsuarioRepository } from './repository/usuario-repository';
// import { UsuarioConsultarUseCase } from './usecases/usuario-consultar.usecase';
// import { UsuarioIncluirArquivoGuardarUseCase } from './usecases/usuario-incluir/usuario-incluir-arquivo-guardar.usecase';
// import { EmailEnviarUseCase_UsuarioIncluir } from './usecases/usuario-incluir/usuario-incluir-email-enviar.usecase';
// import { UsuarioIncluirUseCase } from './usecases/usuario-incluir/usuario-incluir.usecase';
import { RunnerTransaction } from '@libs/common/databases/runner-transaction/runner-transaction';
import { IUsuarioIncluirDto } from './models/dto/usuario-incluir.dto';
import { UsuarioEntity } from './models/entities/usuario.entity';
import { CodigoAcaoEnum } from '@libs/common/enumerations/codigo-acao.enum';
import { UsuarioRepository } from './repositories/usuario-repository';
import { IHistoricoDadosPrimarios } from '@libs/auditoria/models/dto/auditoria-event-list.dto';
import { number } from 'zod';
import { OrigemEnum } from '@libs/common/enumerations/origem.enum';

@Injectable()
export class UsuarioService {

    async usuarioIncluir(input: IUsuarioIncluirDto['input'], request: Request) {

        const queryRunner = await RunnerTransaction.startTransaction([UsuarioEntity]);
        const historico = { ...(await fnHistoricoDadosPrimarios()), codAcao: CodigoAcaoEnum.AUTORIZACAO_INCLUIR };

        const ucArquivo = new UsuarioIncluirArquivoGuardarUseCase(new ArquivosService());
        const arquivo = await ucArquivo.handle(input);

        queryRunner.data = historico;
        const usuarioIncluir = new UsuarioIncluirUseCase(new UsuarioRepository());
        const usuario = await usuarioIncluir.handle(input, arquivo);
        queryRunner.data = null;

        const ucEmailEnviar = new EmailEnviarUseCase_UsuarioIncluir(new EmailService(), new InteressadoRepository(), new UsuarioExternoRepository());
        ucEmailEnviar.handle(input);

        await RunnerTransaction.commitTransaction(queryRunner);
        await RunnerTransaction.finalizeTransaction(queryRunner);

        return usuario;

        async function fnHistoricoDadosPrimarios(): Promise<IHistoricoDadosPrimarios> {
            return <IHistoricoDadosPrimarios>{
                codAcao: CodigoAcaoEnum.NAO_POSSUI_CODIGO_ACAO,
                // TODO: pegar do tokenSystem o codOrigem
                codOrigem: OrigemEnum.PILOTO,
                usuarioId: '0',
                txtEnderecoIp: request.ip,
                txtEnderecoNome: request.hostname
            };
        }
    }

    async usuarioConsultar(input: IUsuarioConsultarDto['input'], request?: Request) {
        const usuarioConsultar = new UsuarioConsultarUseCase(new UtilRepository([UsuarioEntity, Interessado, UsuarioExterno]));
        return await usuarioConsultar.handle(input);
    }

}