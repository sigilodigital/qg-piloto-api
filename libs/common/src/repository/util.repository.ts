import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { EntityTarget, QueryRunner } from 'typeorm';

import { GenericRepository, IGenericRepository } from '../internal';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UtilRepository<T = unknown> extends GenericRepository<T> implements IUtilRepository<T> {

    constructor(@Inject('QUERY_RUNNER_PROVIDER') config?: EntityClassOrSchema[] | QueryRunner) {
        super(null, config);
    }

}

export interface IUtilRepository<T = unknown> extends IGenericRepository<T> { }