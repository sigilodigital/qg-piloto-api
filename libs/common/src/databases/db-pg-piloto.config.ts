import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { DataSourceOptions } from "typeorm";

import { HistoricoSubscriber } from "@libs/auditoria/subscriber/historico.subscriber";
import { env } from "./envSchema";

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
export default function dbPgPilotoConfig(entityList: EntityClassOrSchema[] = []): DataSourceOptions {
    return {
        ...pgPilotoConfig,
        entities: [...entityList]
    };
}
export function dbPgPilotoConfig_fixture(entityList: EntityClassOrSchema[] = []): DataSourceOptions {
    return {
        ...pgPilotoConfig,
        host: 'localhost',
        entities: [...entityList]
    } as DataSourceOptions;
}
