
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { FindOptionsWhere, QueryRunner } from 'typeorm';

import { GenericRepository, IGenericRepository } from '@libs/common/repository/generic.repository';
import { ContatoEntity } from '../models/entities/contato.entity';
import { DataAccessEntity } from '../models/entities/data-access.entity';
import { EmailEntity } from '../models/entities/email.entity';
import { EnderecoEntity } from '../models/entities/endereco.entity';
import { LoginInfoEntity } from '../models/entities/login-info.entity';
import { ProfileEntity } from '../models/entities/profile.entity';
import { TelefoneEntity } from '../models/entities/telefone.entity';
import { UsuarioEntity } from '../models/entities/usuario.entity';

export class UsuarioRepository extends GenericRepository<UsuarioEntity> implements IUsuarioRepository {

    constructor(config?: EntityClassOrSchema[] | QueryRunner) {
        const entityList = [UsuarioEntity, ContatoEntity, EmailEntity, TelefoneEntity, EnderecoEntity, LoginInfoEntity, DataAccessEntity, ProfileEntity];
        super(UsuarioEntity, config || entityList);
    }

    async usuarioFind(usuario: FindOptionsWhere<UsuarioEntity>): Promise<UsuarioEntity[]> {
        await this.init(this.config);
        return await this.queryDataSource.manager.findBy(UsuarioEntity, usuario);
    }

}

export interface IUsuarioRepository extends IGenericRepository<UsuarioEntity> {
    usuarioFind(usuario: UsuarioEntity): Promise<UsuarioEntity[]>;
}
