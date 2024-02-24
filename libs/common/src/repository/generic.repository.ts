import { BadGatewayException, Injectable } from "@nestjs/common";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { DataSource, EntityTarget, FindManyOptions, FindOptionsWhere, QueryRunner, UpdateResult } from "typeorm";

import { AppDataSourceAsync } from "@libs/common/databases";
import { ApiResponse } from "@libs/common/services/response-handler";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity.js";
import { DbConfigOptionsType } from "../databases/db-pg-piloto.config";

@Injectable()
export abstract class GenericRepository<E> implements IGenericRepository<E> {
    protected LOG_CLASS_NAME = 'GenericRepository';

    protected queryDataSource: QueryRunner | DataSource;
    protected config: EntityClassOrSchema[] | QueryRunner = [];
    protected entityClass: EntityTarget<E>;
    protected apiResponse: ApiResponse;

    constructor(entityClass: EntityTarget<E>, config?: EntityClassOrSchema[] | QueryRunner) {
        this.config = config || [];
        //se entityClass eh especialista || senao eh util
        this.entityClass = (entityClass) ? entityClass : this.entityClass;
        this.apiResponse = new ApiResponse<E>();
    }

    async init(config: EntityClassOrSchema[] | QueryRunner): Promise<QueryRunner | DataSource> {
        // se for QueryRunner
        if (!Array.isArray(config)) {
            this.queryDataSource = <QueryRunner>config;
            return this.queryDataSource;
        }
        
        // se ja tiver sido inicializado (com init) >> retorna QueryRunner ou DataSource
        if (this.queryDataSource) return this.queryDataSource;
        // se ja tiver sido inicializado (com new) >> retorna QueryRunner ou DataSource
        if (!Array.isArray(this.config)) {
            this.queryDataSource = <QueryRunner>this.config;
            return this.queryDataSource;
        }
        
        // se chegar como array vazio
        if (config.length === 0) {
            throw new BadGatewayException('ERRO: entityList não pode chegar neste estágio como array vazio.')
        }

        const dbConfigOptions:DbConfigOptionsType = {
            entityList: config
        }
        
        // retorna um DataSource
        this.queryDataSource = await AppDataSourceAsync.init(dbConfigOptions);
        return this.queryDataSource;
    }

    async close(): Promise<void> {
        if (this.queryDataSource instanceof DataSource)
            await this.queryDataSource.destroy();
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

    async findOne(partialEntity: FindManyOptions<E>, entityClass?: EntityTarget<E>) {
        await this.init(this.config);
        const result = await this.queryDataSource.manager.findOne(entityClass || this.entityClass, partialEntity);
        return result;
    }

    async findOneBy(partialEntity: FindOptionsWhere<E>, entityClass?: EntityTarget<E>): Promise<E> {
        await this.init(this.config);
        const result = await this.queryDataSource.manager.findOne(entityClass || this.entityClass, { where: partialEntity });
        return result;
    }

    async save<F>(entityList: F[], entityClass?: EntityTarget<F>, pkProperty?: string, dbSequenceName?: string, dbSchema?: string): Promise<F[]> {
        await this.init(this.config);

        if (pkProperty)
            entityList[pkProperty] = await this.getSequence(dbSequenceName, dbSchema);

        try {
            const result = await this.queryDataSource.manager.save(entityClass || <EntityTarget<F>>this.entityClass, entityList);
            return result;
        } catch (error) {
            return error;
            // (this.queryDataSource instanceof DataSource)
            //     ? undefined
            //     : RunnerTransaction.rollbackTransaction(this.queryDataSource);
            // throw new BadGatewayException(this.apiResponse.handler({
            //     objMessage: MSG.DEFAULT_FALHA,
            //     error: {
            //         message: 'Erro ao tentar persistir dados no DB.',
            //         fix: ''
            //             + '(1) conferir a conexão com o DB'
            //             + '(2) conferir as configurações da conexão com o DB',
            //         context: {
            //             className: this.LOG_CLASS_NAME,
            //             methodName: this.save.name,
            //             input: entityList,
            //             output: error
            //         }
            //     }
            // }));
        }
    }

    async update<F>(criteria?: Partial<F>, partialEntity?: QueryDeepPartialEntity<F>, entityClass?: EntityTarget<F>): Promise<UpdateResult> {
        await this.init(this.config);
        const result = await this.queryDataSource.manager.update(entityClass || <EntityTarget<F>>this.entityClass, criteria, partialEntity);
        // const result = <F>await this.queryDataSource.manager.save(entityClass || this.entityClass, partialEntity);
        // const result = await this.queryDataSource.manager.save(criteria);
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
    // update<F>(criteria: Partial<F>, entity: QueryDeepPartialEntity<F>, entityClass?: EntityTarget<F>): Promise<F>;
    update(criteria: Partial<E>, entity: QueryDeepPartialEntity<E>, entityClass?: EntityTarget<E>): Promise<UpdateResult>;
    query(sql: string): Promise<E>;
    getSequence(dbSequenceName: string, dbScheme?: string): Promise<number>;
}
