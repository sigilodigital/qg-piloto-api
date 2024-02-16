import { InsertEvent, RemoveEvent, UpdateEvent } from "typeorm";
import { Entity } from "typeorm-model-generator";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";

type AlteracaoTituloType = 'Alteração de registro' | 'Inclusão de registro' | 'Exclusão de registro';
export type RegistroEventType = Array<{ insert?: InsertEvent<any>, update?: UpdateEvent<any>, delete?: RemoveEvent<any>; }>[0];
export type RegistroAlteracaoType = Array<{ property: string, original: string, alterado: string; }>;
export type OperacaoDB = InsertEvent<Entity> | UpdateEvent<Entity> | RemoveEvent<Entity>;

export class ParseEntityForSql {

    async getSql(event: RegistroEventType) {
        if (event?.insert) return await this.getInsertSql(event.insert);

        if (event?.update) return await this.getUpdateSql(event.update);

        if (event.delete) return await this.getDeleteSql(event.delete);
    }

    async getSelectSql(event: RegistroEventType) {
        const evento = await this.extractEvent(event);
        let fields = ``;
        let conditional = ``;
        let virgula = `, `;
        evento.operacao.metadata.columns.forEach((value: ColumnMetadata, i: number) => {
            if (evento.operacao.metadata.columns.length == i + 1) virgula = ``;
            fields += `${value.databaseName} AS "${value.propertyName}"${virgula}`;
        });
        evento.operacao.metadata.primaryColumns.forEach((value: ColumnMetadata, i: number) => {
            conditional += ` ${value.databaseName} = ${evento.operacao.entity[value.propertyName]}${i < (evento.operacao.metadata.primaryColumns.length - 1)? ` AND `: ``}`;

        });
        const sql = ` SELECT ${fields} FROM PUBLIC.${evento.operacao.metadata.tableName} ${evento.operacao.metadata.targetName} WHERE ${conditional} `;
        return <string><unknown>sql;
    }

    async getInsertSql(insertEvent: InsertEvent<Entity>) {
        let fields = ``;
        let values = ``;
        let virgula = `, `;
        insertEvent.metadata.columns.forEach((value: ColumnMetadata, i) => {
            if (insertEvent.metadata.columns.length == i + 1) virgula = ``;
            fields += `${value.databaseName}${virgula}`;
            values += `${insertEvent.entity[value.propertyName]}${virgula}`;
        });

        const sql = `INSERT INTO ${insertEvent.metadata.tableName} (${fields}) VALUES (${values});`;
        return sql;
    }

    async getUpdateSql(updateEvent: UpdateEvent<Entity>) {
        let setValues = ``;
        let conditional = `1 = 1 `;
        let virgula = `, `;

        updateEvent.updatedColumns.forEach((value: ColumnMetadata, i) => {
            if (updateEvent.updatedColumns.length == i + 1) virgula = ``;
            setValues += `${value.databaseName} = ${updateEvent.entity[value.propertyName]}${virgula}`;
        });

        virgula = `, `;

        updateEvent.metadata.primaryColumns.forEach((value: ColumnMetadata, i) => {
            if (updateEvent.updatedColumns.length == i + 1) virgula = ``;
            conditional += ` AND ${value.databaseName} = ${updateEvent.entity[value.propertyName]}${virgula}`;
        });

        const sql = ` UPDATE ${updateEvent.metadata.tableName} SET ${setValues} WHERE ${conditional} `;
        return sql;
    }

    async getDeleteSql(deleteEvent: RemoveEvent<Entity>) {
        let conditional = ` `;
        deleteEvent.metadata.primaryColumns.forEach((value: ColumnMetadata, i) => {
            conditional = ` ${value.databaseName} = ${deleteEvent.entity[value.propertyAliasName]}`;
        });
        const sql = `DELETE FROM ${deleteEvent.metadata.tableName} WHERE ${conditional}`;
        return sql;
    }

    async extractEvent(event: RegistroEventType): Promise<{
        event: RegistroEventType,
        entity: Entity,
        operacao: OperacaoDB,
        tituloOperacao: AlteracaoTituloType;
    }> {
        if (event.insert)
            return {
                event,
                entity: event.insert.entity,
                operacao: event.insert,
                tituloOperacao: 'Inclusão de registro'
            };

        if (event.update)
            return {
                event,
                entity: event.update.databaseEntity,
                operacao: event.update,
                tituloOperacao: 'Alteração de registro'
            };

        if (event.delete)
            return {
                event,
                entity: event.delete.entity,
                operacao: event.delete,
                tituloOperacao: 'Exclusão de registro'
            };
    }
}