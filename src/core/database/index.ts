import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    //Todo corrigir a cobertura das credecias de banco
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: 'piloto',//configurations().database.username,
    password: 'piloto123',
    database: 'piloto',
    synchronize: false,
});

AppDataSource.initialize()
    .then(() => {
        console.warn("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err);
    })


