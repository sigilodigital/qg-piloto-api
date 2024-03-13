import { Inject, Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';

import { GenericRepository, IGenericRepository } from '@libs/common/repository/generic.repository';
import { ContatoEntity } from '@sd-root/libs/common/src/models/entities/contato/contato.entity';
import { EmailEntity } from '@sd-root/libs/common/src/models/entities/contato/email.entity';
import { EnderecoEntity } from '@sd-root/libs/common/src/models/entities/contato/endereco.entity';
import { TelefoneEntity } from '@sd-root/libs/common/src/models/entities/contato/telefone.entity';
import { AvaliadorDocumentacaoEntity } from '../models/entities/avaliador-documentacao.entity';
import { AvaliadorEntity } from '../models/entities/avaliador.entity';
import { UsuarioEntity } from '../../usuario/models/entities/usuario.entity';
import { LoginInfoEntity } from '../../usuario/models/entities/login-info.entity';
import { DataAccessEntity } from '../../usuario/models/entities/data-access.entity';
import { ProfileEntity } from '../../usuario/models/entities/profile.entity';

@Injectable()
export class AvaliadorRepository extends GenericRepository<AvaliadorEntity> implements IAvaliadorRepository {

    constructor(@Inject('QUERY_RUNNER_PROVIDER') config?: QueryRunner) {
        const entityList = [
            UsuarioEntity, LoginInfoEntity, DataAccessEntity, ProfileEntity,
            AvaliadorEntity, AvaliadorDocumentacaoEntity, AvaliadorDocumentacaoEntity,
            ContatoEntity, EmailEntity, TelefoneEntity, EnderecoEntity
        ];
        super(AvaliadorEntity, config || entityList);
    }

}

export interface IAvaliadorRepository extends IGenericRepository<AvaliadorEntity> { }
