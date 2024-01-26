import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { DataSource } from "typeorm";
import dbPgPilotoConfig from "./db-pg-piloto.config";

export class AppDataSourceAsync {

    static async init(entityList: EntityClassOrSchema[]) {

        const dataSource = new DataSource(dbPgPilotoConfig(entityList));

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