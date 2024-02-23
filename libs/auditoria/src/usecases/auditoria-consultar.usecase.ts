import { Between, Equal, FindOptionsWhere, Like } from 'typeorm';
import { IAuditoriaConsultarDto } from '../models/dto/auditoria-consultar.dto';
import { IUtilRepository } from '@libs/common/repository/util.repository';
import { AuditoriaEntity } from '../models/entities/auditoria.entity';


export class AuditoriaConsultarUseCase {

    constructor(private repository: IUtilRepository) { }

    public async handle(input: IAuditoriaConsultarDto['input']) {
        await this.repository.init([AuditoriaEntity]);

        let where: FindOptionsWhere<AuditoriaEntity>;

        if (input.dtInicial && input.dtFinal)
            where.dtAcao = Between(input.dtInicial, input.dtFinal);

        if (input.usuarioId)
            where.usuarioId = Equal(input.usuarioId);

        if (input.operacaoTipo)
            where.txtAlteracao = Like(input.operacaoTipo);

        return await this.repository.findBy(where, AuditoriaEntity);
    }

}