import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ExceptionHttpService } from './exception-http/exception-http.service';
import dbPgPilotoConfig from '@libs/common/databases/db-pg-piloto.config';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(dbPgPilotoConfig()),
        UsuarioModule,
        AuthModule,
        // AuditoriaModule,
        // CommonModule,

        // CodigoVerificacaoModule,
        // InteressadoModule,
        // UsuarioExternoModule,
        // SistemaMensagemFilaModule,
        // UtilsModule,
        // RecuperacaoSenhaModule,
        // SistemaWsModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule { }
