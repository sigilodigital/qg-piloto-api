import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { EntityTarget, QueryRunner } from 'typeorm';

import { GenericRepository } from './generic_for_util.repository';

export class UtilRepository<T = unknown, C = EntityTarget<T>> extends GenericRepository<T> implements IUtilRepository {

    constructor(config?: EntityClassOrSchema[] | QueryRunner) {
        super(null, config);
    }

}

export interface IUtilRepository { }