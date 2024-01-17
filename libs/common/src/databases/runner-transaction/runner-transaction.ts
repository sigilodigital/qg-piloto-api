import { QueryRunner } from "typeorm";
import { AppDataSourceAsync } from "@libs/common/databases";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";

export class RunnerTransaction {

    private static async createQueryRunner(entityList:EntityClassOrSchema[]): Promise<QueryRunner> {

        return (await AppDataSourceAsync.init(entityList)).createQueryRunner()

        // return AppDataSource.createQueryRunner();
    }

    public static async startTransaction(entityList:EntityClassOrSchema[]): Promise<QueryRunner> {
        const queryRunner = await RunnerTransaction.createQueryRunner(entityList);
        await queryRunner.connect();
        await queryRunner.startTransaction();
        return queryRunner
    }

    public static async commitTransaction(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.commitTransaction();
    }

    public static async rollbackTransaction(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.rollbackTransaction()
    }
    public static async finalizeTransaction(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.release()
    }
}