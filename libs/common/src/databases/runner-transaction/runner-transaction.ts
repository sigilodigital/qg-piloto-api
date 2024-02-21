import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { QueryRunner } from "typeorm";

import { AppDataSourceAsync } from "@libs/common/databases";
import { DbConfigOptionType } from "../db-pg-piloto.config";

export class RunnerTransaction {

    private static async createQueryRunner(entityList: EntityClassOrSchema[], dbOption?: DbConfigOptionType): Promise<QueryRunner> {
        const queryRunner = (await AppDataSourceAsync.init(entityList, dbOption)).createQueryRunner();
        return queryRunner;
        // return AppDataSource.createQueryRunner();
    }

    public static async startTransaction(entityList: EntityClassOrSchema[], dbOption?: DbConfigOptionType): Promise<QueryRunner> {
        const queryRunner = await RunnerTransaction.createQueryRunner(entityList, dbOption);
        await queryRunner.connect();
        await queryRunner.startTransaction();
        return queryRunner;
    }

    public static async commitTransaction(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.commitTransaction();
    }

    public static async rollbackTransaction(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.rollbackTransaction();
    }
    public static async finalizeTransaction(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.release();
    }
}