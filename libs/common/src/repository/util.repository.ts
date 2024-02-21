import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { EntityTarget, QueryRunner } from 'typeorm';

import { GenericRepository, IGenericRepository } from './generic.repository';

export class UtilRepository<T = unknown, C = EntityTarget<T>> extends GenericRepository<T> implements IUtilRepository<T> {

    constructor(config?: EntityClassOrSchema[] | QueryRunner) {
        super(null, config);
    }

}

export interface IUtilRepository<T = unknown, C = EntityTarget<T>> extends IGenericRepository<T> { }