
import { InteressadoEntity } from 'src/interessado/entities/interessado.entity';
import { AppDataSource } from '../../database/index';
import { UsuarioExterno } from 'src/usuario-externo/entities/usuario-externo.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { SistemaMetodoDto } from 'src/sistema-ws/dto/sistemaMetodoWs.dto';

export class AuthRepository implements IAuthRepository {

    private queryDataSource: QueryRunner | DataSource;

    constructor(queryRunner?: QueryRunner) {
        this.queryDataSource = queryRunner || AppDataSource;
    }

    async findByCnpjCpf(txtCnpjCpf: string): Promise<UsuarioExterno & InteressadoEntity> {
        const interessado = await this.queryDataSource.manager.findOne(InteressadoEntity, { where: { txtCnpjCpf } });
        if (!interessado) return null;
        const usuarioExterno = await this.queryDataSource.manager.findOne(UsuarioExterno, { where: { codInteressado: interessado.codInteressado } });
        if (!usuarioExterno) return null;
        return { ...usuarioExterno, ...interessado };
    }

    async update(entity: SistemaMetodoDto): Promise<SistemaMetodoDto> {
        return await this.queryDataSource.manager.save(entity);
    }

    find(entity: SistemaMetodoDto): Promise<SistemaMetodoDto[]> {
        return this.queryDataSource.manager.find(SistemaMetodoDto, { where: entity });
    }

    async findOne(entity: SistemaMetodoDto): Promise<SistemaMetodoDto> {
        return await this.queryDataSource.manager.findOne(SistemaMetodoDto, { where: entity });
    }

}

export interface IAuthRepository {
    findByCnpjCpf(txtCnpjCpf: string): Promise<UsuarioExterno & InteressadoEntity>;
}
