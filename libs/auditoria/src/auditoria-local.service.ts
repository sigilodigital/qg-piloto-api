import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { AxiosHeaders } from 'axios';
import { Request } from 'express';
import { EntityTarget } from 'typeorm';
import { Entity } from 'typeorm-model-generator';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { UtilRepository } from '@libs/common/repository/util.repository';
import { AuditoriaEntity } from './models/entities/auditoria.entity';

@Injectable()
export class AuditoriaLocalService {

    readonly url = process.env.API_CONFIG_GERAIS;
    readonly urn = '/configuracao/configuracao-valor-consultar';
    
    auditoria: AuditoriaEntity = new AuditoriaEntity();
    utilRepository: UtilRepository

    static async getSqlInsert(entity: Entity, entityClass: EntityTarget<Entity>, entityName: string): Promise<string> {

        const queryDataSource = await (new UtilRepository()).init([<EntityClassOrSchema>entityClass])
        
        const query = queryDataSource.manager
            .createQueryBuilder(entityClass, entityName)
            .insert().values(<QueryDeepPartialEntity<Entity>>entity)
            .getQueryAndParameters();

        return fnReplaceQuery(query);

        function fnReplaceQuery(query: [string, any[]]) {

            let sql = query[0];

            for (const [i, e] of query[1])
                sql = sql.replace(':' + (i + 1), e);

            return sql;
        }
    }

    static async getCodUsuario(req: Request): Promise<string> {
        const localService = new AuditoriaLocalService();
        const httpService = new HttpService();
        const headers = new AxiosHeaders({ Authorization: "Bearer " + req.headers['tokenSystem'] });
        const uri = localService.url + localService.urn;
        try {
            return (await httpService.axiosRef(uri, { headers, method: 'POST' })).data;
        } catch (error) {
            console.error(error);
        }
    }

    


}
