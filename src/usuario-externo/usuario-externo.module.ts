import { Module } from '@nestjs/common';
import { UsuarioExternoService } from './usuario-externo.service';

@Module({
  providers: [UsuarioExternoService],
  exports: [UsuarioExternoService]
})
export class UsuarioExternoModule {}
