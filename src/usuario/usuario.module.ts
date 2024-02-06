import { Module } from '@nestjs/common';

import { UsuarioRepository } from './repositories/usuario-repository';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';

@Module({
    controllers: [UsuarioController],
    providers: [UsuarioService, UsuarioRepository],
    exports: [UsuarioService, UsuarioRepository]
})
export class UsuarioModule { }
