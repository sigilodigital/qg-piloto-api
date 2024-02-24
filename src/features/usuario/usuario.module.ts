import { Module } from '@nestjs/common';

import { QUERY_RUNNER_PROVIDER } from '@sd-root/libs/common/src/providers/query-runner.provider';
import { UsuarioRepository } from './repositories/usuario.repository';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';

@Module({
    controllers: [UsuarioController],
    providers: [UsuarioService, UsuarioRepository, QUERY_RUNNER_PROVIDER],
    exports: [UsuarioService, UsuarioRepository, QUERY_RUNNER_PROVIDER]
})
export class UsuarioModule { }