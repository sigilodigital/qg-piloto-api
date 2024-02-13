import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import dbPgPilotoConfig from '@libs/common/databases/db-pg-piloto.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AppMiddleware } from './app.middleware';
import { RequestMethod } from '@nestjs/common/enums';

@Module({
    imports: [
        TypeOrmModule,
        // TypeOrmModule.forRoot(dbPgPilotoConfig()),
        UsuarioModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AppMiddleware)
            .exclude({ path: '/auth/sistema-autenticar', method: RequestMethod.POST })
            .forRoutes(
                { path: '*', method: RequestMethod.ALL }
            );
    }
}
