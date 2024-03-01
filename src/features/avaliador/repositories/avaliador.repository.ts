import { Inject, Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';

import { GenericRepository, IGenericRepository } from '@libs/common/repository/generic.repository';
import { ContatoEntity } from '@sd-root/libs/common/src/models/entities/contato/contato.entity';
import { UsuarioEntity } from '../../usuario/models/entities/usuario.entity';
import { AvaliadorEntity } from '../models/entities/avaliador.entity';

@Injectable()
export class AvaliadorRepository extends GenericRepository<AvaliadorEntity> implements IAvaliadorRepository {

    constructor(@Inject('QUERY_RUNNER_PROVIDER') config?: QueryRunner) {
        const entityList = [AvaliadorEntity, UsuarioEntity, ContatoEntity];
        super(AvaliadorEntity, config || entityList);
    }

}

export interface IAvaliadorRepository extends IGenericRepository<AvaliadorEntity> { }
