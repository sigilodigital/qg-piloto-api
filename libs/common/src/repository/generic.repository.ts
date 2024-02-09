import { BadGatewayException } from "@nestjs/common";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { DataSource, EntityTarget, FindManyOptions, FindOptionsWhere, QueryRunner } from "typeorm";

import { AppDataSourceAsync } from "@libs/common/databases";
import { RunnerTransaction } from "@libs/common/databases/runner-transaction/runner-transaction";
import { ApiResponse } from "@sd-root/libs/common/src/services/response-handler-v1";

export abstract class GenericRepository<E> implements IGenericRepository<E> {

    protected queryDataSource: QueryRunner | DataSource;
    protected config: EntityClassOrSchema[] | QueryRunner;
    protected entityClass: EntityTarget<E>;

    protected constructor(entityClass: EntityTarget<E>, config?: EntityClassOrSchema[] | QueryRunner) {
        this.config = config;
        this.entityClass = entityClass;
    }

    protected async init(config: EntityClassOrSchema[] | QueryRunner): Promise<QueryRunner | DataSource> {
        if (this.queryDataSource) return this.queryDataSource;
        if (!config) config = [<EntityClassOrSchema>this.entityClass];
        this.queryDataSource = (Array.isArray(config)) ? await AppDataSourceAsync.init(config) : config;
        return this.queryDataSource;
    }

    async find(object: FindManyOptions<E>): Promise<any[]> {
        await this.init(this.config);
        const result = await this.queryDataSource.manager.find(this.entityClass, object);
        return result;
    }

    async findBy(object: FindOptionsWhere<E>): Promise<any[]> {
        await this.init(this.config);
        const result = await this.queryDataSource.manager.find(this.entityClass, { where: object });
        return result;
    }

    async findOne(object: FindManyOptions<E>): Promise<any> {
        await this.init(this.config);
        const result = await this.queryDataSource.manager.findOne(this.entityClass, object);
        return result;
    }

    async findOneBy(object: FindOptionsWhere<E>): Promise<any> {
        await this.init(this.config);
        const result = await this.queryDataSource.manager.findOne(this.entityClass, { where: object });
        return result;
    }

    async save(object: E): Promise<E> {
        await this.init(this.config);
        // object.codT = await (new UtilRepository()).getSequence('S_XXXXXXXX');
        try {
            const result = await this.queryDataSource.manager.save(object);
            return result;
        } catch (error) {
            (this.queryDataSource instanceof DataSource)
                ? undefined
                : RunnerTransaction.rollbackTransaction(this.queryDataSource);
            throw new BadGatewayException(ApiResponse.handler({ codMessage: 60 }));
        }
    }

    async update(object: E): Promise<E> {
        await this.init(this.config);
        const result = await this.queryDataSource.manager.save(object);
        return result;
    }

}

export interface IGenericRepository<E> {
    find(object: FindManyOptions<E>): Promise<E[]>;
    findBy(object: FindOptionsWhere<E>): Promise<E[]>;
    findOne(object: FindManyOptions<E>): Promise<E>;
    findOneBy(object: FindOptionsWhere<E>): Promise<E>;
    save(object: E): Promise<E>;
    update(object: E): Promise<E>;
}
