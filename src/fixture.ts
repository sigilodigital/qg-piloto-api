import { NestFactory } from '@nestjs/core';

import { UtilRepository } from '@libs/common/repository/util.repository';
import { AppModule } from './app.module';
import usuarios from './fixtures/usuarios';
import { ContatoEntity } from './usuario/models/entities/contato.entity';
import { EmailEntity } from './usuario/models/entities/email.entity';
import { EnderecoEntity } from './usuario/models/entities/endereco.entity';
import { TelefoneEntity } from './usuario/models/entities/telefone.entity';
import { UsuarioEntity } from './usuario/models/entities/usuario.entity';
import { LoginInfoEntity } from './usuario/models/entities/login-info.entity';
import { DataAccessEntity } from './usuario/models/entities/data-access.entity';
import { ProfileEntity } from './usuario/models/entities/profile.entity';
import configs from '@libs/common/configs';

async function bootstrap() {

    const app = await NestFactory.create(AppModule);

    await app.init();

    // const dataSouce = app.get<DataSource>(getDataSourceToken())
    // await dataSouce.synchronize(true)

    const entities  =[
        UsuarioEntity, 
        ContatoEntity, 
        EmailEntity, 
        TelefoneEntity, 
        EnderecoEntity,
        LoginInfoEntity,
        DataAccessEntity,
        ProfileEntity
    ]
    const utilRepo = await (new UtilRepository()).init(entities);
    await utilRepo.manager.connection.dropDatabase()
    await utilRepo.manager.connection.synchronize(true)

    await utilRepo.manager.save(UsuarioEntity, usuarios.usuario)

    console.log(await utilRepo.manager.find(UsuarioEntity))
    console.log(await utilRepo.manager.find(ContatoEntity))
    console.log(await utilRepo.manager.find(EmailEntity))
    console.log(await utilRepo.manager.find(TelefoneEntity))
    console.log(await utilRepo.manager.find(EnderecoEntity))

    app.close()
    // await app.listen(configs().server.port, "0.0.0.0");
}

bootstrap();
