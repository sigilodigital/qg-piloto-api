import { BadGatewayException } from "@nestjs/common";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { DataSource, EntityTarget, FindManyOptions, FindOptionsWhere, QueryRunner, UpdateResult } from "typeorm";

import { AppDataSourceAsync } from "@libs/common/databases";
import { RunnerTransaction } from "@libs/common/databases/runner-transaction/runner-transaction";
import { ApiResponse } from "@libs/common/services/response-handler";
import { MSG } from "../services/code-messages";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity.js";

export abstract class GenericRepository<E> implements IGenericRepository<E> {
    protected LOG_CLASS_NAME = 'GenericRepository';

    protected queryDataSource: QueryRunner | DataSource;
    protected config: EntityClassOrSchema[] | QueryRunner;
    protected entityClass: EntityTarget<E>;
    protected apiResponse: ApiResponse;

    protected constructor(entityClass: EntityTarget<E>, config?: EntityClassOrSchema[] | QueryRunner) {
        this.config = config;
        this.entityClass = (entityClass) ? entityClass : this.entityClass;
        this.apiResponse = new ApiResponse<E>();
    }

    async init(config?: EntityClassOrSchema[] | QueryRunner): Promise<QueryRunner | DataSource> {
        if (!config) config = [<EntityClassOrSchema>this.entityClass];
        if (this.queryDataSource) return this.queryDataSource;
        // if (!config) config = [];
        this.queryDataSource = (Array.isArray(config)) ? await AppDataSourceAsync.init(config) : config;
        return this.queryDataSource;
    }

    async find(partialEntity: FindManyOptions<E>, entityClass?: EntityTarget<E>): Promise<E[]> {
        await this.init(this.config);
        const result = await this.queryDataSource.manager.find(entityClass || this.entityClass, partialEntity);
        return result;
    }

    async findBy(partialEntity: FindOptionsWhere<E>, entityClass?: EntityTarget<E>): Promise<E[]> {
        await this.init(this.config);
        const result = await this.queryDataSource.manager.find(entityClass || this.entityClass, { where: partialEntity });
        return result;
    }

    async findOne(partialEntity: FindManyOptions<E>, entityClass?: EntityTarget<E>): Promise<E> {
        await this.init(this.config);
        const result = await this.queryDataSource.manager.findOne(entityClass || this.entityClass, partialEntity);
        return result;
    }

    async findOneBy(partialEntity: FindOptionsWhere<E>, entityClass?: EntityTarget<E>): Promise<E> {
        await this.init(this.config);
        const result = await this.queryDataSource.manager.findOne(entityClass || this.entityClass, { where: partialEntity });
        return result;
    }

    async save(entityList: E[], entityClass?: EntityTarget<E>, pkProperty?: string, dbSequenceName?: string, dbSchema?: string): Promise<E[]> {
        await this.init(this.config);

        entityList[pkProperty] = (pkProperty) ? await this.getSequence(dbSequenceName, dbSchema) : undefined;

        try {
            const result = await this.queryDataSource.manager.save(entityClass || this.entityClass, entityList);
            return result;
        } catch (error) {
            (this.queryDataSource instanceof DataSource)
                ? undefined
                : RunnerTransaction.rollbackTransaction(this.queryDataSource);
            throw new BadGatewayException(error);
            throw new BadGatewayException(this.apiResponse.handler({
                objMessage: MSG.DEFAULT_FALHA,
                error: {
                    message: 'Erro ao tentar persistir dados no DB.',
                    fix: ''
                        + '(1) conferir a conexão com o DB',
                    context: {
                        className: this.LOG_CLASS_NAME,
                        methodName: this.save.name,
                        input: entityList,
                        output: error
                    }
                }
            }));
        }
    }

    async update(criteria?: Partial<E>, entity?: QueryDeepPartialEntity<E>, entityClass?: EntityTarget<E>): Promise<UpdateResult> {
        await this.init(this.config);
        const result = this.queryDataSource.manager.update(entityClass, criteria, entity);
        return result;
    }

    async query<E>(sql: string): Promise<E> {
        await this.init(this.config);
        return this.queryDataSource.manager.query(sql);
    }

    async getSequence(dbSequenceName: string, dbScheme?: string): Promise<number> {
        await this.init(this.config);
        // TODO: pegar o schema dinamicamente pelo datasource
        const sequence = (await this.queryDataSource.manager.query(`SELECT ${dbScheme}.${dbSequenceName}.NEXTVAL FROM DUAL`))[0].NEXTVAL;
        return sequence;
    }

}

export interface IGenericRepository<E> {
    init(config?: EntityClassOrSchema[] | QueryRunner): Promise<QueryRunner | DataSource>;
    find(partialEntity: FindManyOptions<E>, entityClass?: EntityTarget<E>): Promise<E[]>;
    findBy(partialEntity: FindOptionsWhere<E>, entityClass?: EntityTarget<E>): Promise<E[]>;
    findOne(partialEntity: FindManyOptions<E>, entityClass?: EntityTarget<E>): Promise<E>;
    findOneBy(partialEntity: FindOptionsWhere<E>, entityClass?: EntityTarget<E>): Promise<E>;
    save(entity: E[], pkProperty?: string, dbSequenceName?: string): Promise<E[]>;
    update(criteria: Partial<E>, entity: QueryDeepPartialEntity<E>, entityClass?: EntityTarget<E>): Promise<UpdateResult>;
    query(sql: string): Promise<E>;
    getSequence(dbSequenceName: string, dbScheme?: string): Promise<number>;
}
