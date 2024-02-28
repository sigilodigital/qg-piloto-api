import { Inject, Injectable } from '@nestjs/common';
import { FindOptionsWhere, QueryRunner } from 'typeorm';

import { GenericRepository, IGenericRepository } from '@libs/common/repository/generic.repository';
import { ContatoEntity } from '../models/entities/contato.entity';
import { DataAccessEntity } from '../models/entities/data-access.entity';
import { EmailEntity } from '../models/entities/email.entity';
import { EnderecoEntity } from '../models/entities/endereco.entity';
import { LoginInfoEntity } from '../models/entities/login-info.entity';
import { ProfileEntity } from '../models/entities/profile.entity';
import { TelefoneEntity } from '../models/entities/telefone.entity';
import { AvaliadorEntity } from '../models/entities/avaliador.entity';

@Injectable()
export class AvaliadorRepository extends GenericRepository<AvaliadorEntity> implements IAvaliadorRepository {

    constructor(@Inject('QUERY_RUNNER_PROVIDER') config?: QueryRunner) {
        const entityList = [AvaliadorEntity, ContatoEntity, EmailEntity, TelefoneEntity, EnderecoEntity, LoginInfoEntity, DataAccessEntity, ProfileEntity];
        super(AvaliadorEntity, config || entityList);
    }

    async getUserList(partialEntity: FindOptionsWhere<AvaliadorEntity>): Promise<AvaliadorEntity[]> {
        await this.init(this.config);
        return await this.queryDataSource.manager.findBy(AvaliadorEntity, partialEntity);
    }

    async getLoginInfoByUserId(id: FindOptionsWhere<string>): Promise<LoginInfoEntity> {
        await this.init(this.config);
        return (await this.queryDataSource.manager.findOne(AvaliadorEntity, { where: { id }, relations: { _loginInfo: true } }))?._loginInfo;
    }

    async getDataAccessByUserId(id: FindOptionsWhere<string>): Promise<DataAccessEntity> {
        await this.init(this.config);
        return (await this.queryDataSource.manager.findOne(AvaliadorEntity, { where: { id }, relations: { _dataAccess: true } }))?._dataAccess;
    }

}

export interface IAvaliadorRepository extends IGenericRepository<AvaliadorEntity> {
    getUserList(avaliador: FindOptionsWhere<AvaliadorEntity>): Promise<AvaliadorEntity[]>;
    getLoginInfoByUserId(avaliador: FindOptionsWhere<string>): Promise<LoginInfoEntity>;
    getDataAccessByUserId(avaliador: FindOptionsWhere<string>): Promise<DataAccessEntity>;
}
