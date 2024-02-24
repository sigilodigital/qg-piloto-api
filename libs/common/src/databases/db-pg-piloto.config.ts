import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { DataSourceOptions, MixedList } from "typeorm";

import { env } from "./envSchema";

export type DbConfigOptionsType = {
    dbOption?: DbOptionType;
    subscriberList?: MixedList<string | Function>;
    entityList: EntityClassOrSchema[]
}
export type DbConfigType2 = (eL: EntityClassOrSchema[]) => DataSourceOptions;
export type DbOptionType =
    | 'pg_piloto_default'
    | 'pg_piloto_default_fixture'
    | 'pg_piloto_test';

export function dbConfig(dbConfigOption: DbConfigOptionsType): DataSourceOptions {
    switch (dbConfigOption.dbOption) {
        case 'pg_piloto_default':
            return dbConfig_pgPilotoDefault(dbConfigOption);
        case 'pg_piloto_default_fixture':
            return dbConfig_pgPilotoFixture(dbConfigOption);
        case 'pg_piloto_test':
            return dbConfig_pgPilotoTest(dbConfigOption);
        default:
            return dbConfig_pgPilotoDefault(dbConfigOption);
    }
}

const pgPilotoConfig: DataSourceOptions = {
    type: 'postgres',
    host: env.DB_HOST,
    port: parseInt(env.DB_PORT),
    ssl: false,
    database: env.DB_NAME,
    schema: env.DB_SCHEMA,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    synchronize: false,
    subscribers: [/*HistoricoSubscriber*/],
    entities: [
        // '**/entities/*.entity',
        // '**/entities/*.dto'
    ]
};
export function dbConfig_pgPilotoDefault(dbConfigOption: DbConfigOptionsType): DataSourceOptions {
    return {
        ...pgPilotoConfig,
        // host: 'pg_piloto',
        subscribers: [...dbConfigOption.entityList],
        entities: [...dbConfigOption.entityList]
    } as DataSourceOptions;
}
export function dbConfig_pgPilotoFixture(dbConfigOption: DbConfigOptionsType): DataSourceOptions {
    return {
        ...pgPilotoConfig,
        host: 'localhost',
        subscribers: [...dbConfigOption.entityList],
        entities: [...dbConfigOption.entityList]
    } as DataSourceOptions;
}

function dbConfig_pgPilotoTest(dbConfigOption: DbConfigOptionsType): DataSourceOptions {
    return {
        ...pgPilotoConfig,
        host: 'localhost',
        schema: 'test',
        subscribers: [...dbConfigOption.entityList],
        entities: [...dbConfigOption.entityList]
    } as DataSourceOptions;
}