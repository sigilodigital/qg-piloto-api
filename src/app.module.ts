import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import dbPgPilotoConfig from '@libs/common/databases/db-pg-piloto.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsuarioModule } from './usuario/usuario.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(dbPgPilotoConfig()),
        UsuarioModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule { }
