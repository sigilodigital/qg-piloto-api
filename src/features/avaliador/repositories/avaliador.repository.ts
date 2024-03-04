import { Inject, Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';

import { GenericRepository, IGenericRepository } from '@libs/common/repository/generic.repository';
import { AvaliadorDocumentacaoEntity } from '../models/entities/avaliador-documentacao.entity';
import { AvaliadorEntity } from '../models/entities/avaliador.entity';

@Injectable()
export class AvaliadorRepository extends GenericRepository<AvaliadorEntity> implements IAvaliadorRepository {

    constructor(@Inject('QUERY_RUNNER_PROVIDER') config?: QueryRunner) {
        const entityList = [AvaliadorEntity, AvaliadorDocumentacaoEntity];
        super(AvaliadorEntity, config || entityList);
    }

}

export interface IAvaliadorRepository extends IGenericRepository<AvaliadorEntity> { }
