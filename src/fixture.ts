import { NestFactory } from '@nestjs/core';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AppModule } from './app.module';
import { UsuarioRepository } from './usuario/repositories/usuario-repository';
import { UsuarioEntity } from './usuario/models/entities/usuario.entity';
import { UtilRepository } from '@libs/common/repository/util.repository';
import { ContatoEntity } from './usuario/models/entities/contato.entity';
import { EmailEntity } from './usuario/models/entities/email.entity';

async function bootstrap() {

    const app = await NestFactory.create(AppModule);

    await app.init();

    // const dataSouce = app.get<DataSource>(getDataSourceToken())
    // await dataSouce.synchronize(true)

    const utilRepo = await (new UtilRepository()).init([UsuarioEntity, ContatoEntity, EmailEntity]);
    // await utilRepo.manager.connection.dropDatabase()
    await utilRepo.manager.connection.synchronize(true)

//     const email = new EmailEntity()
//     const contato = new ContatoEntity()
// const emailList:EmailEntity[] = []
// emailList.push({ address: 'ricardo1@dias.com' })
// emailList.push({ address: 'ricardo2@dias.com' })

// contato._emailList = emailList

    await utilRepo.manager.insert(UsuarioEntity, [{
        fullname: 'Ricardo Dias',
        cpf: 12345678901,
        _contato: { _emailList: [{ address: 'ricardo1@dias.com' }, { address: 'ricardo2@dias.com' }] },
        password: 'abcd1234',
        isActive: true,
    }, {
        fullname: 'Haroldo Cruz',
        cpf: 12345678902,
        _contato: { _emailList: [{ address: 'haroldo2@cruz.com' }, { address: 'haroldo2@cruz.com' }] },
        password: 'abcd1234',
        isActive: true,
    }])

    console.log(await utilRepo.manager.find(UsuarioEntity))
    console.log(await utilRepo.manager.find(ContatoEntity))
    console.log(await utilRepo.manager.find(EmailEntity))

    app.close()
}

bootstrap();
