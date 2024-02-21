import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { DataSource } from "typeorm";
import { DbConfigOptionType, dbConfig } from "./db-pg-piloto.config";


export class AppDataSourceAsync {

    static async init(entityList: EntityClassOrSchema[], dbConfigType?: DbConfigOptionType): Promise<DataSource> {

        const dbOption = (dbConfigType) ? dbConfigType : 'pg_piloto_default';
        const dataSource = new DataSource(dbConfig(entityList, dbOption));

        await dataSource.initialize()
            .then(() => {
                console.info("Data Source has been initialized! " + entityList.length);
            })
            .catch((err) => {
                console.error("Error during Data Source initialization", err);
            });

        return dataSource;
    }

    static async close(dataSource: DataSource): Promise<void> {
        await dataSource.destroy();
    }
}