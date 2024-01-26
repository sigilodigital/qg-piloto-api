import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { DataSourceOptions } from "typeorm";

import { HistoricoSubscriber } from "@libs/auditoria/subscriber/historico.subscriber";
import { env } from "./envSchema";

export default function dbPgPilotoConfig(entityList: EntityClassOrSchema[] = []): DataSourceOptions {
    return {
        type: 'postgres',
        host: env.DB_HOST,
        port: parseInt(env.DB_PORT),
        ssl: false,
        database: env.DB_NAME,
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        schema: env.DB_SCHEMA,
        synchronize: false,
        subscribers: [HistoricoSubscriber],
        entities: [
            // '**/entities/*.entity',
            // '**/entities/*.dto'
            ...entityList
        ]
    }
}
