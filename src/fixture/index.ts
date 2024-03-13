import { NestFactory } from '@nestjs/core';

import { UtilRepository } from '@libs/common/repository/util.repository';
import { RunnerTransaction } from '@sd-root/libs/common/src/databases/runner-transaction/runner-transaction';
import { ContatoEntity } from '../../libs/common/src/models/entities/contato/contato.entity';
import { EmailEntity } from '../../libs/common/src/models/entities/contato/email.entity';
import { EnderecoEntity } from '../../libs/common/src/models/entities/contato/endereco.entity';
import { TelefoneEntity } from '../../libs/common/src/models/entities/contato/telefone.entity';
import { AppModule } from '../app.module';
import { MetodoEntity } from '../core/auth/models/entities/metodo.entity';
import { SistemaEntity } from '../core/auth/models/entities/sistema.entity';
import { AvaliadorEntity } from '../features/avaliador/models/entities/avaliador.entity';
import { DataAccessEntity } from '../features/usuario/models/entities/data-access.entity';
import { LoginInfoEntity } from '../features/usuario/models/entities/login-info.entity';
import { ProfileEntity } from '../features/usuario/models/entities/profile.entity';
import { UsuarioEntity } from '../features/usuario/models/entities/usuario.entity';
import { UsuarioRepository } from '../features/usuario/repositories/usuario.repository';
import { avaliadorList } from './models/avaliadores';
import { methodList } from './models/methods';
import { systemList } from './models/systems';
import { userList } from './models/users';
import { AvaliadorDocumentacaoEntity } from '../features/avaliador/models/entities/avaliador-documentacao.entity';
import { AvaliadorRepository } from '../features/avaliador/repositories/avaliador.repository';

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
        AvaliadorEntity, AvaliadorDocumentacaoEntity
    ];

    const queryRunner = await RunnerTransaction.startTransaction(entities);

    let utilRepo = new UtilRepository<unknown>(queryRunner);
    let userRepo = new UsuarioRepository(queryRunner);
    let avaliadorRepo = new AvaliadorRepository(queryRunner);

    await queryRunner.connection.dropDatabase();
    await queryRunner.connection.synchronize(true);

    const m = await utilRepo.save(methodList, MetodoEntity);
    const s = await utilRepo.save(systemList, SistemaEntity);

    s[0]._metodoList.push(m[0]);
    await utilRepo.save([s[0]], SistemaEntity);

    const uL = await userRepo.save(userList);
    const us = await userRepo.update({}, { socialname: 'Haroldinho' });

    avaliadorList[0]._usuario = uL[0];
    const a = await avaliadorRepo.save(avaliadorList);

    // console.log(await utilRepo.find({}, UsuarioEntity));
    // console.log(await utilRepo.find({}, ContatoEntity));
    // console.log(await utilRepo.find({}, EmailEntity));
    // console.log(await utilRepo.find({}, TelefoneEntity));
    // console.log(await utilRepo.find({}, EnderecoEntity));
    // console.log(await utilRepo.find({}, LoginInfoEntity));
    // console.log(await utilRepo.find({}, DataAccessEntity));
    // console.log(await utilRepo.find({}, ProfileEntity));
    // console.log(await utilRepo.find({ loadRelationIds: true }, SistemaEntity));
    // console.log(await utilRepo.find({}, MetodoEntity));
    console.log(await avaliadorRepo.find({ loadRelationIds: true }));

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
