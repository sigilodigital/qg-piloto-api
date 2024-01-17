import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UsuarioExterno } from './entities/usuario-externo.entity';

@Injectable()
export class UsuarioExternoService {
  constructor(public dataSource: DataSource){}

  async findOne(codInteressado: number):Promise<UsuarioExterno> {
    return await this.dataSource.manager.findOne(UsuarioExterno, {where: {codInteressado: codInteressado}})
  }

  async update(updateUsuarioExterno: UsuarioExterno) {
    return await this.dataSource.manager.save(updateUsuarioExterno)
  }

}
