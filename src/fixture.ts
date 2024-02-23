import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';

import { UtilRepository } from '@libs/common/repository/util.repository';
import { dbConfig_pgPilotoFixture } from '@libs/common/databases/db-pg-piloto.config';
import { AppModule } from './app.module';
import { ContatoEntity } from './features/usuario/models/entities/contato.entity';
import { DataAccessEntity } from './features/usuario/models/entities/data-access.entity';
import { EmailEntity } from './features/usuario/models/entities/email.entity';
import { EnderecoEntity } from './features/usuario/models/entities/endereco.entity';
import { LoginInfoEntity } from './features/usuario/models/entities/login-info.entity';
import { ProfileEntity } from './features/usuario/models/entities/profile.entity';
import { TelefoneEntity } from './features/usuario/models/entities/telefone.entity';
import { UsuarioEntity } from './features/usuario/models/entities/usuario.entity';
import { SistemaEntity } from './core/auth/models/entities/sistema.entity';
import { MetodoEntity } from './core/auth/models/entities/metodo.entity';
import { SistemaMetodoEntity } from './core/auth/models/entities/sistema-metodo.entity';
import { userList } from './fixtures/users';
import { systemList } from './fixtures/systems';
import { methodList } from './fixtures/methods';
import { UsuarioRepository } from './features/usuario/repositories/usuario-repository';
import { AppDataSourceAsync } from '@sd-root/libs/common/src/databases';
import { RunnerTransaction } from '@sd-root/libs/common/src/databases/runner-transaction/runner-transaction';

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
    ];

    const queryRunner = await RunnerTransaction.startTransaction(entities, 'pg_piloto_default_fixture');
    let conn: DataSource;
    let utilRepo = new UtilRepository<unknown>(queryRunner);
    let userRepo = new UsuarioRepository(queryRunner);
    await queryRunner.connection.dropDatabase();
    await queryRunner.connection.synchronize(true);
    const m = await utilRepo.save(methodList, MetodoEntity);
    const s = await utilRepo.save(systemList, SistemaEntity);
    s[0]._metodoList.push(m[0]);
    await utilRepo.save([s[0]], SistemaEntity);
    await userRepo.save(userList);
    await userRepo.update({}, { socialname: 'Haroldinho' });

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
