import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';

import { UtilRepository } from '@libs/common/repository/util.repository';
import { dbConfig_pgPilotoFixture } from '@libs/common/databases/db-pg-piloto.config';
import { AppModule } from './app.module';
import { ContatoEntity } from '../libs/common/src/models/entities/contato/contato.entity';
import { DataAccessEntity } from './features/usuario/models/entities/data-access.entity';
import { EmailEntity } from '../libs/common/src/models/entities/contato/email.entity';
import { EnderecoEntity } from '../libs/common/src/models/entities/contato/endereco.entity';
import { LoginInfoEntity } from './features/usuario/models/entities/login-info.entity';
import { ProfileEntity } from './features/usuario/models/entities/profile.entity';
import { TelefoneEntity } from '../libs/common/src/models/entities/contato/telefone.entity';
import { UsuarioEntity } from './features/usuario/models/entities/usuario.entity';
import { SistemaEntity } from './core/auth/models/entities/sistema.entity';
import { MetodoEntity } from './core/auth/models/entities/metodo.entity';
import { SistemaMetodoEntity } from './core/auth/models/entities/sistema-metodo.entity';
import { userList } from './fixtures/users';
import { systemList } from './fixtures/systems';
import { methodList } from './fixtures/methods';
import { AppDataSourceAsync } from '@sd-root/libs/common/src/databases';
import { RunnerTransaction } from '@sd-root/libs/common/src/databases/runner-transaction/runner-transaction';
import { UsuarioRepository } from './features/usuario/repositories/usuario.repository';
import { AvaliadorEntity } from './features/avaliador/models/entities/avaliador.entity';
import { avaliadorList } from './fixtures/avaliadores';

async function bootstrap() {

    console.time('fixture');
    const app = await NestFactory.create(AppModule);

    await app.init();

    // const dataSouce = app.get<DataSource>(getDataSourceToken())
    // await dataSouce.synchronize(true)

    const entities = [
        UsuarioEntity, ContatoEntity, EmailEntity, TelefoneEntity,
        EnderecoEntity, LoginInfoEntity, DataAccessEntity, ProfileEntity,
        SistemaEntity, MetodoEntity, /*SistemaMetodoEntity*/
        AvaliadorEntity
    ];

    const queryRunner = await RunnerTransaction.startTransaction(entities);

    let utilRepo = new UtilRepository<unknown>(queryRunner);
    let userRepo = new UsuarioRepository(queryRunner);

    await queryRunner.connection.dropDatabase();
    await queryRunner.connection.synchronize(true);

    const m = await utilRepo.save(methodList, MetodoEntity);
    const s = await utilRepo.save(systemList, SistemaEntity);

    s[0]._metodoList.push(m[0]);
    await utilRepo.save([s[0]], SistemaEntity);

    const uL = await userRepo.save(userList);
    await userRepo.update({}, { socialname: 'Haroldinho' });
    
    avaliadorList[0]._usuario = uL[0];
    const a = await utilRepo.save(avaliadorList, AvaliadorEntity);

    console.log(await utilRepo.find({}, UsuarioEntity));
    console.log(await utilRepo.find({}, ContatoEntity));
    console.log(await utilRepo.find({}, EmailEntity));
    console.log(await utilRepo.find({}, TelefoneEntity));
    console.log(await utilRepo.find({}, EnderecoEntity));
    console.log(await utilRepo.find({}, LoginInfoEntity));
    console.log(await utilRepo.find({}, DataAccessEntity));
    console.log(await utilRepo.find({}, ProfileEntity));
    console.log(await utilRepo.find({loadRelationIds: true}, SistemaEntity));
    console.log(await utilRepo.find({}, MetodoEntity));
    console.log(await utilRepo.find({}, AvaliadorEntity));

    console.time('commit');
    await RunnerTransaction.commitTransaction(queryRunner);
    console.timeEnd('commit');
    console.time('finalize');
    await RunnerTransaction.finalizeTransaction(queryRunner);
    console.timeEnd('finalize');

    await app.close().finally(async () => {
        console.log('app closed');
    });
    console.timeEnd('fixture');
    // await app.listen(configs().server.port, "0.0.0.0");
}

bootstrap();
