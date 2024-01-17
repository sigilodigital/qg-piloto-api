import { Module } from '@nestjs/common';
import { RecuperacaoSenhaController } from './recuperacao-senha.controller';
import { RecuperacaoSenhaService } from './recuperacao-senha.service';
import { UsuarioExternoModule } from 'src/usuario-externo/usuario-externo.module';
import { SistemaMensagemFilaModule } from 'src/sistema-mensagem-fila/sistema-mensagem-fila.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [UsuarioExternoModule, SistemaMensagemFilaModule, UtilsModule],
  controllers: [RecuperacaoSenhaController],
  providers: [
    RecuperacaoSenhaService, 
   ]
})
export class RecuperacaoSenhaModule {}
