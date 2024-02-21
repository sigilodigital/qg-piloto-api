

import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DataSource, EntityTarget, FindManyOptions, FindOptionsWhere, QueryRunner, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { AppDataSourceAsync } from '../databases';

export class UtilRepository_v1 implements IUtilRepository {

    protected queryDataSource: QueryRunner | DataSource;
    protected config: EntityClassOrSchema[] | QueryRunner;

    constructor(config?: EntityClassOrSchema[] | QueryRunner) { this.config = config; }

    async init(config: EntityClassOrSchema[] | QueryRunner): Promise<QueryRunner | DataSource> {
        if (this.queryDataSource) return this.queryDataSource;
        if (!config) config = [];
        this.queryDataSource = (Array.isArray(config)) ? await AppDataSourceAsync.init(config) : config;
        return this.queryDataSource;
    }

    async getSequence(name: string): Promise<number> {
        await this.init(this.config);
        // TODO: pegar o schema dinamicamente pelo datasource
        const sequence = (await this.queryDataSource.manager.query(`SELECT PUBLIC.${name}.NEXTVAL FROM DUAL`))[0].NEXTVAL;
        return sequence;
    }

    async find<T>(entityClass: EntityTarget<T>, queryPartialEntity: FindManyOptions<T>): Promise<Array<T>> {
        await this.init(this.config);
        return this.queryDataSource.manager.find(entityClass, queryPartialEntity);
    }

    async findBy<T>(entityClass: EntityTarget<T>, partialEntity: FindOptionsWhere<T>): Promise<Array<T>> {
        await this.init(this.config);
        // const options: FindOptionsWhere<T> = {};
        return this.queryDataSource.manager.find(entityClass, { where: partialEntity });
    }

    async findOne<T>(entityClass: EntityTarget<T>, queryPartialEntity: FindManyOptions<T>): Promise<T | null> {
        await this.init(this.config);
        // this.queryDataSource.manager.connection.entityMetadatas.push(<EntityMetadata><unknown>entityClass)
        return this.queryDataSource.manager.findOne(entityClass, queryPartialEntity);
    }

    async findOneBy<T>(entityClass: EntityTarget<T>, partialEntity: FindOptionsWhere<T>): Promise<T | null> {
        await this.init(this.config);
        // this.queryDataSource.manager.connection.entityMetadatas.push(<EntityMetadata><unknown>entityClass)
        return this.queryDataSource.manager.findOne(entityClass, { where: partialEntity });
    }

    async save<T>(entity: T, pkProperty: string, sequenceName: string): Promise<T> {
        await this.init(this.config);
        entity[pkProperty] = await this.getSequence(sequenceName);
        return await this.queryDataSource.manager.save(entity);
    }

    async update<T>(entityClass: EntityTarget<T>, criteria: Partial<T>, entity: QueryDeepPartialEntity<T>): Promise<UpdateResult> {
        await this.init(this.config);
        const result = this.queryDataSource.manager.update(entityClass, criteria, entity);
        return result;
    }

    async query<T>(sql: string): Promise<T> {
        await this.init(this.config);
        return this.queryDataSource.manager.query(sql);
    }

}

export interface IUtilRepository {
    init(config?: EntityClassOrSchema[] | QueryRunner): Promise<QueryRunner | DataSource>;
    getSequence(name: string): Promise<number>;
    find<T>(entityClass: EntityTarget<T>, queryPartialEntity: FindManyOptions<T>): Promise<Array<T>>;
    findBy<T>(entityClass: EntityTarget<T>, partialEntity: FindOptionsWhere<T>): Promise<Array<T>>;
    findOne<T>(entityClass: EntityTarget<T>, queryPartialEntity: FindOptionsWhere<T>): Promise<T | null>;
    save<T>(entity: T, pkProperty: string, sequenceName: string): Promise<T>;
    update<T>(entityClass: EntityTarget<T>, criteria: T, entity: QueryDeepPartialEntity<T>): Promise<UpdateResult>;
    query<T>(sql: string): Promise<T>;
}