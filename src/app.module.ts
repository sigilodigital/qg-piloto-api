import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestMethod } from '@nestjs/common/enums';

import { AppController } from './app.controller';
import { AppMiddleware } from './app.middleware';
import { AppService } from './app.service';
import { AuthModule } from './core/auth/auth.module';
import { UsuarioModule } from './features/usuario/usuario.module';
import { AvaliadorModule } from './features/avaliador/avaliador.module';
import configs from '@sd-root/libs/common/src/configs';

@Module({
    imports: [
        TypeOrmModule,
        // TypeOrmModule.forRoot(dbPgPilotoConfig()),
        AuthModule,
        UsuarioModule,
        AvaliadorModule,
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {

        const { appEnv } = configs().environment;
        if (["development", "test"].includes(appEnv)) return;

        consumer
            .apply(AppMiddleware)
            .exclude({ path: '/', method: RequestMethod.GET })
            .exclude({ path: '/api/*', method: RequestMethod.ALL })
            .exclude({ path: '/auth/sistema-autenticar', method: RequestMethod.POST })
            .forRoutes(
                { path: '*', method: RequestMethod.ALL }
            );
    }
}
