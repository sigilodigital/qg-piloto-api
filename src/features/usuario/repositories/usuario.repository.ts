import { Inject, Injectable } from '@nestjs/common';
import { FindOptionsWhere, QueryRunner } from 'typeorm';

import { GenericRepository, IGenericRepository } from '@libs/common/repository/generic.repository';
import { ContatoEntity } from '../../../../libs/common/src/models/entities/contato/contato.entity';
import { DataAccessEntity } from '../models/entities/data-access.entity';
import { EmailEntity } from '../../../../libs/common/src/models/entities/contato/email.entity';
import { EnderecoEntity } from '../../../../libs/common/src/models/entities/contato/endereco.entity';
import { LoginInfoEntity } from '../models/entities/login-info.entity';
import { ProfileEntity } from '../models/entities/profile.entity';
import { TelefoneEntity } from '../../../../libs/common/src/models/entities/contato/telefone.entity';
import { UsuarioEntity } from '../models/entities/usuario.entity';

@Injectable()
export class UsuarioRepository extends GenericRepository<UsuarioEntity> implements IUsuarioRepository {

    constructor(@Inject('QUERY_RUNNER_PROVIDER') config?: QueryRunner) {
        const entityList = [UsuarioEntity, ContatoEntity, EmailEntity, TelefoneEntity, EnderecoEntity, LoginInfoEntity, DataAccessEntity, ProfileEntity];
        super(UsuarioEntity, config || entityList);
    }

    async preload(user: UsuarioEntity){
        await this.init(this.config);
        const result = this.queryDataSource.manager.getRepository(UsuarioEntity).preload(user)
        return result;
    }

    async getUserList(partialEntity: FindOptionsWhere<UsuarioEntity>): Promise<UsuarioEntity[]> {
        await this.init(this.config);
        return await this.queryDataSource.manager.findBy(UsuarioEntity, partialEntity);
    }

    async getLoginInfoByUserId(id: FindOptionsWhere<string>): Promise<LoginInfoEntity> {
        await this.init(this.config);
        return (await this.queryDataSource.manager.findOne(UsuarioEntity, { where: { id }, relations: { _loginInfo: true } }))?._loginInfo;
    }

    async getDataAccessByUserId(id: FindOptionsWhere<string>): Promise<DataAccessEntity> {
        await this.init(this.config);
        return (await this.queryDataSource.manager.findOne(UsuarioEntity, { where: { id }, relations: { _dataAccess: true } }))?._dataAccess;
    }

}

export interface IUsuarioRepository extends IGenericRepository<UsuarioEntity> {
    getUserList(usuario: FindOptionsWhere<UsuarioEntity>): Promise<UsuarioEntity[]>;
    getLoginInfoByUserId(usuario: FindOptionsWhere<string>): Promise<LoginInfoEntity>;
    getDataAccessByUserId(usuario: FindOptionsWhere<string>): Promise<DataAccessEntity>;
}
