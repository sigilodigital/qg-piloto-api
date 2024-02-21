import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { DataSource, DataSourceOptions } from "typeorm";

import { dbConfig_pgPiloto as dbConfig_pgPilotoDefault } from "./db-pg-piloto.config";

export class AppDataSourceAsync {

    static async init(entityList: EntityClassOrSchema[], dbConfig?: DbConfigType): Promise<DataSource> {

        if(!dbConfig) dbConfig = dbConfig_pgPilotoDefault

        const dataSource = new DataSource(dbConfig(entityList));

        await dataSource.initialize()
            .then(() => {
                console.info("Data Source has been initialized! " + entityList.length);
            })
            .catch((err) => {
                console.error("Error during Data Source initialization", err);
            });

        return dataSource;
    }
}

type DbConfigType = (eL: EntityClassOrSchema[]) => DataSourceOptions;