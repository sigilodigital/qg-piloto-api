import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InteressadoEntity } from './entities/interessado.entity';

@Injectable()
export class InteressadoService {
    constructor(public dataSource: DataSource) { }
    async findOneByCnpjCpf(txtCnpjCpf: string): Promise<InteressadoEntity> {
        return await this.dataSource.manager.findOne(InteressadoEntity, { where: { txtCnpjCpf: txtCnpjCpf } });
    }

    async findOneByCodInteressado(codInteressado: number): Promise<InteressadoEntity> {
        return await this.dataSource.manager.findOne(InteressadoEntity, { where: { codInteressado: codInteressado } });
    }

}
