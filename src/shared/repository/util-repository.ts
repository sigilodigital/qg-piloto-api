
import { AppDataSource } from '@sd-root/src/core/database';
import { DataSource, EntityTarget, FindOptionsWhere, QueryRunner } from 'typeorm';
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class UtilRepository implements IUtilRepository {

    private queryDataSource: QueryRunner | DataSource;

    constructor(queryRunner?: QueryRunner) {
        this.queryDataSource = queryRunner || AppDataSource;
    }

    find<T>(entityClass: EntityTarget<T>, partialEntity: FindOptionsWhere<T>): Promise<Array<T>> {
        return this.queryDataSource.manager.find(entityClass, { where: partialEntity });
    }

    findOne<T>(entityClass: EntityTarget<T>, partialEntity: FindOptionsWhere<T>): Promise<T> {
        return this.queryDataSource.manager.findOne(entityClass, { where: partialEntity });
    }

    async save<T>(entity: T, pkProperty: string, sequenceName: string): Promise<T> {
        entity[pkProperty] = await this.getSequence(sequenceName);
        return await this.queryDataSource.manager.save(entity);
    }

    update<T>(entityClass: EntityTarget<T>, entity: T, entityName: string): Promise<T> {
        const query = this.queryDataSource.manager
            .createQueryBuilder(entityClass, entityName)
            .update().setParameters(entity).getQuery();
        return this.queryDataSource.manager.query(query);
    }

    query<T>(sql: string): Promise<T> {
        return this.queryDataSource.manager.query(sql);
    }

    async getSequence(name: string): Promise<number> {
        const sequence = (await this.queryDataSource.manager.query(`SELECT IUSR_PROTON.${name}.NEXTVAL FROM DUAL`))[0].NEXTVAL;
        return sequence;
    }
}

export interface IUtilRepository {
    find<T>(entityClass: EntityTarget<T>, partialEntity: FindOptionsWhere<T>): Promise<Array<T>>;
    findOne<T>(entityClass: EntityTarget<T>, partialEntity: FindOptionsWhere<T>): Promise<T>;
    save<T>(entity: T, pkProperty: string, sequenceName: string): Promise<T>;
    update<T>(entityClass: EntityTarget<T>, entity: T, entityNameDb: string): Promise<T>;
    query<T>(sql: string): Promise<T>;
    getSequence(name: string): Promise<number>;
}

function fnRemoveNull(obj: unknown) {
    let newObj = {};
    Object.keys(obj).forEach((property) => {
        if (obj[property]) newObj = { [property]: obj[property], ...newObj };
    });
    return newObj;
}