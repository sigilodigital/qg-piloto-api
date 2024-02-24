import { EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, TransactionCommitEvent, UpdateEvent } from "typeorm";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";

import { ParseEntityForSql } from "../local-service/parse-entity-for-sql.service";
import { IHistoricoDadosPrimarios, AuditoriaEventListDto } from "../models/dto/auditoria-event-list.dto";

import { AuditoriaIncluirEventListUseCase } from "../usecases/auditoria-incluir-event-list.usecase";
import { BadGatewayException } from "@nestjs/common";
import { UtilRepository } from "@libs/common/internal";
import { AuditoriaEntity } from "../models/entities/auditoria.entity";
import { ApiResponse } from "@libs/common/services/response-handler-v1";
import { formatDateTime } from "@libs/common/utils";
import { TipoFormatoDataEnum } from "@libs/common/enumerations/tipo-formato-data.enum";


export type RegistroAlteracaoType = Array<{ property: string, original: string, alterado: string; }>;
export type RegistroEventType = Array<{ insert?: InsertEvent<any>, update?: UpdateEvent<any>, delete?: RemoveEvent<any>; }>[0];

@EventSubscriber()
export class HistoricoSubscriber implements EntitySubscriberInterface {

    public utilRepository: UtilRepository;
    public parseSql: ParseEntityForSql;
    private auditoriaEventListDto: AuditoriaEventListDto;

    constructor() {
        this.utilRepository = new UtilRepository();
        this.parseSql = new ParseEntityForSql();
        this.auditoriaEventListDto = new AuditoriaEventListDto();
    }

    async afterInsert(event: InsertEvent<any>): Promise<void | Promise<any>> {
        if (fnSeForUmaEntidadeAuditavel(event.metadata.name)) return;
        if (!event.queryRunner.data['codAcao']) return;
        if (fnSeDadosHistoricoVazio(event.queryRunner?.data)) return;

        const historicoDadosPrimarios = <IHistoricoDadosPrimarios>event.queryRunner.data;
        event.queryRunner.data = null;

        if (event.queryRunner.isTransactionActive)
            this.auditoriaEventListDto.add(await this.getAuditoriaEntity({ insert: event }, historicoDadosPrimarios));

    }

    async afterUpdate(event: UpdateEvent<any>) {
        if (fnSeForUmaEntidadeAuditavel(event.metadata.name)) return;
        if (!event.queryRunner.data['codAcao']) return;
        if (fnSeDadosHistoricoVazio(event.queryRunner?.data)) return;

        const historicoDadosPrimarios = <IHistoricoDadosPrimarios>event.queryRunner.data;

        if (event.queryRunner.isTransactionActive)
            this.auditoriaEventListDto.add(await this.getAuditoriaEntity({ update: event }, historicoDadosPrimarios));

    }

    async afterRemove(event: RemoveEvent<any>) {
        if (fnSeForUmaEntidadeAuditavel(event.metadata.name)) return;
        if (!event.queryRunner.data['codAcao']) return;
        if (fnSeDadosHistoricoVazio(event.queryRunner?.data)) return;

        const historicoDadosPrimarios = <IHistoricoDadosPrimarios>event.queryRunner.data;

        if (event.queryRunner.isTransactionActive)
            this.auditoriaEventListDto.add(await this.getAuditoriaEntity({ delete: event }, historicoDadosPrimarios));

    }

    async beforeTransactionCommit(event: TransactionCommitEvent): Promise<void | Promise<any>> {
        if (event.queryRunner.isTransactionActive) {
            const auditoriaIncluirEventListUseCase = new AuditoriaIncluirEventListUseCase();
            await auditoriaIncluirEventListUseCase.handler(this.auditoriaEventListDto.get());
            this.auditoriaEventListDto.resetEvents();
        }
    }

    async getAuditoriaEntity(regEvent: RegistroEventType, historicoDadosPrimarios: IHistoricoDadosPrimarios) {
        const event = regEvent.insert || regEvent.update || regEvent.delete;
        const pKey = await this.getPK(event);
        if (!pKey.value) return

        const historicoDados: AuditoriaEntity = {
            ...historicoDadosPrimarios,
            dtAcao: (await formatDateTime({ typeFormat: TipoFormatoDataEnum.DATABASE })).dateTime,
            codOrgao: 0,
            // txtSql: await this.utilRepository.getSql(regEvent),
            txtSql: await this.parseSql.getSql({ insert: regEvent?.insert, update: regEvent?.update, delete: regEvent?.delete }),
            codChave: pKey.value,
            txtAlteracao: (regEvent.update) ? await this.fnGetAlteracao(pKey, event) : "Inserção de registro"
        };
        return historicoDados;
    }

    async getPKValue(event: RegistroEventType): Promise<number> {
        let codChave = 0;
        const evento = await this.parseSql.extractEvent(event);
        evento.operacao.metadata.primaryColumns.forEach((value: ColumnMetadata) => {
            codChave = evento.operacao.entity[value.propertyName];
        });
        return codChave;
    }

    async getPK(event: RemoveEvent<any> | InsertEvent<any>): Promise<{ key: string, value: number; }> {
        const key = event.metadata.primaryColumns[0].propertyName;
        const value = event.entity[key];
        return { key, value };
    }

    async fnGetAlteracao(pKey: { key: string, value: number; }, event: RemoveEvent<any> | InsertEvent<any>) {

        const entityName = event.metadata.name;
        const entityNew = event.entity;
        const entityOld = await event.queryRunner.manager.findOne(entityName, { where: { [pKey.key]: pKey.value } });

        if (!entityNew || !entityOld)
            throw new BadGatewayException(ApiResponse.handler({ codMessage: 60 }));

        let texto = `Alteração de registro:\n`;
        const c = new Comparador();
        const alteracaoList: RegistroAlteracaoType = c.comparaObjetos(entityNew, entityOld);
        for await (const campo of alteracaoList)
            texto += `\n${campo.property}: DE: ${campo.original} PARA: ${campo.alterado}`;

        return texto;
    }

}

export class Comparador {
    public comparaObjetos(anterior: unknown, atual: unknown): RegistroAlteracaoType {
        const registroList: RegistroAlteracaoType = [];
        Object.keys(anterior).forEach((property) => {
            if (this.sePrimitivo(typeof anterior[property])) {
                if (this.seAlterado(anterior[property], atual[property]))
                    registroList.push({ property, original: anterior[property], alterado: atual[property] });
            }
        });
        return registroList;
    }

    private seAlterado(c1: unknown, c2: unknown): boolean {
        return c1 != c2;
    }

    private sePrimitivo(type: string) {
        const primitivos = ['undefined', 'null', 'boolean', 'number', 'string'];
        return primitivos.includes(type);
    }
}

function fnSeDadosHistoricoVazio(dadosHistorico: any) {
    return !dadosHistorico;
}

function fnSeForUmaEntidadeAuditavel(entityName: string) {
    const entidades = ["AuditoriaEntity", "SistemaMensagemFilaEmail"] 
    return entidades.includes(entityName)
}



