import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { DataSourceOptions } from "typeorm";

import { HistoricoSubscriber } from "@libs/auditoria/subscriber/historico.subscriber";
import { env } from "./envSchema";

export type DbConfigType = (eL: EntityClassOrSchema[]) => DataSourceOptions;
export type DbConfigOptionType =
    | 'pg_piloto_default'
    | 'pg_piloto_default_fixture'
    | 'pg_piloto_test';

export function dbConfig(entityList: EntityClassOrSchema[] = [], dbConfigOptionType: DbConfigOptionType): DataSourceOptions {
    switch (dbConfigOptionType) {
        case 'pg_piloto_default':
            return dbConfig_pgPilotoDefault(entityList);
        case 'pg_piloto_default_fixture':
            return dbConfig_pgPilotoFixture(entityList);
        case 'pg_piloto_test':
            return dbConfig_pgPilotoTest(entityList);
        default:
            return dbConfig_pgPilotoDefault(entityList);
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
    subscribers: [HistoricoSubscriber],
    entities: [
        // '**/entities/*.entity',
        // '**/entities/*.dto'
    ]
};
export function dbConfig_pgPilotoDefault(entityList: EntityClassOrSchema[] = []): DataSourceOptions {
    return {
        ...pgPilotoConfig,
        host: 'pg_piloto',
        entities: [...entityList]
    } as DataSourceOptions;
}
export function dbConfig_pgPilotoFixture(entityList: EntityClassOrSchema[] = []): DataSourceOptions {
    return {
        ...pgPilotoConfig,
        host: 'localhost',
        entities: [...entityList]
    } as DataSourceOptions;
}

function dbConfig_pgPilotoTest(entityList: EntityClassOrSchema[] = []): DataSourceOptions {
    return {
        ...pgPilotoConfig,
        host: 'localhost',
        schema: 'test',
        entities: [...entityList]
    } as DataSourceOptions;
}