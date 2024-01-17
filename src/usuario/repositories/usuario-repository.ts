
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { MoreThanOrEqual, QueryRunner } from 'typeorm';

import { GenericRepository, IGenericRepository } from '@libs/common/repository/generic.repository';
import { UsuarioEntity } from '../models/entities/usuario.entity';

export class UsuarioRepository extends GenericRepository<UsuarioEntity> implements IUsuarioRepository {

    constructor(config?: EntityClassOrSchema[] | QueryRunner) { super(UsuarioEntity, config); }

    async usuarioFind(usuario: UsuarioEntity): Promise<UsuarioEntity[]> {
        await this.init(this.config);
        return await this.queryDataSource.manager.findBy(UsuarioEntity, usuario);
    }

}

export interface IUsuarioRepository extends IGenericRepository<UsuarioEntity> {
    usuarioFind(usuario: UsuarioEntity): Promise<UsuarioEntity[]>;
}
