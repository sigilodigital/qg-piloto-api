import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExceptionHttpService } from './exception-http/exception-http.service';
import { UsuarioModule } from './usuario/usuario.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'piloto-db',
            port: 5432,
            username: 'piloto',
            password: 'piloto123',
            database: 'piloto',
            synchronize: true,
            ssl: false,
            entities: [
            ]
        }),
        UsuarioModule
        // AuditoriaModule,
        // CommonModule,
        
        // CodigoVerificacaoModule,
        // AuthModule,
        // InteressadoModule,
        // UsuarioExternoModule,
        // SistemaMensagemFilaModule,
        // UtilsModule,
        // RecuperacaoSenhaModule,
        // SistemaWsModule
    ],
    controllers: [AppController],
    providers: [AppService, ExceptionHttpService]
})
export class AppModule { }
