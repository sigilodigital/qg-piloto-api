import { BadGatewayException } from "@nestjs/common";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { DataSource, EntityTarget, FindManyOptions, FindOptionsWhere, QueryRunner } from "typeorm";

import { AppDataSourceAsync } from "@libs/common/databases";
import { RunnerTransaction } from "@libs/common/databases/runner-transaction/runner-transaction";
import { ApiResponse } from "@libs/common/services/response-handler";
import { MSG } from "../services/code-messages";

export abstract class GenericRepository_v1<E> implements IGenericRepository<E> {
    protected LOG_CLASS_NAME = 'GenericRepository';

    protected queryDataSource: QueryRunner | DataSource;
    protected config: EntityClassOrSchema[] | QueryRunner;
    protected entityClass: EntityTarget<E>;
    protected apiResponse: ApiResponse;

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
        try {
            const result = await this.queryDataSource.manager.save(object);
            return result;
        } catch (error) {
            (this.queryDataSource instanceof DataSource)
                ? undefined
                : RunnerTransaction.rollbackTransaction(this.queryDataSource);
            throw new BadGatewayException(this.apiResponse.handler({
                objMessage: MSG.DEFAULT_FALHA,
                error: {
                    message: 'Erro ao tentar persistir dados no DB.',
                    fix: ''
                        + '(1) conferir a conexão com o DB',
                    context: {
                        className: this.LOG_CLASS_NAME,
                        methodName: this.save.name,
                        input: object,
                        output: error
                    }
                }
            }));
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
