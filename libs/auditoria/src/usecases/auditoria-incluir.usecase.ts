import { IUtilRepository, UtilRepository } from "@libs/common/repository/util.repository";
import { IAuditoriaIncluirDto } from "../models/dto/auditoria-incluir.dto";
import { AuditoriaEntity } from "../models/entities/auditoria.entity";


export class AuditoriaIncluirUseCase {
    constructor(private utilRepository: IUtilRepository) {}

    public async handle(input: IAuditoriaIncluirDto['input']) {
        //TODO: remover "as *Entity" do objeto; verificar os campos obrigatórios da entidade
        const entity = new AuditoriaEntity({...input} as AuditoriaEntity);
        const auditoriaRepository = await this.utilRepository.init([AuditoriaEntity]);
        return await auditoriaRepository.manager.insert(AuditoriaEntity, entity);
    }

}