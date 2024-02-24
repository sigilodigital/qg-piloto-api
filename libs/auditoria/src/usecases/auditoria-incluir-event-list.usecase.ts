import { UtilRepository } from "@libs/common/internal";
import { AuditoriaEntity } from "../models/entities/auditoria.entity";
import { AuditoriaIncluirUseCase } from './auditoria-incluir.usecase';

export class AuditoriaIncluirEventListUseCase{
    async handler(input: AuditoriaEntity[]) {
        const ucAuditoria = new AuditoriaIncluirUseCase(new UtilRepository());
        for (const evento of input) {
            if (evento != undefined)
                await ucAuditoria.handle(evento)
        }
    }
}