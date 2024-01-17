import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { DataSourceOptions } from "typeorm";

import { HistoricoSubscriber } from "@libs/auditoria/subscriber/historico.subscriber";

export default function dbOrclProtonConfig(entityList: EntityClassOrSchema[] = []): DataSourceOptions {
    return {
        type: 'oracle',
        host: process.env.DB_HOST,
        port: parseInt(<string>process.env.DB_PORT, 1521) || 1521,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        schema: process.env.DB_SCHEMA,
        serviceName: process.env.DB_SERVICE_NAME,
        synchronize: false,
        subscribers: [HistoricoSubscriber],
        entities: [
            // '**/entities/*.entity',
            // '**/entities/*.dto'
            ...entityList
        ]
    }
}
