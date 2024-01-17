import { Module } from '@nestjs/common';
import { SistemaMensagemFilaService } from './sistema-mensagem-fila.service';
import { SistemaMensagemFilaController } from './sistema-mensagem-fila.controller';
import { CommonModule } from '@libs/common';

@Module({
  imports: [CommonModule],
  controllers: [SistemaMensagemFilaController],
  providers: [SistemaMensagemFilaService],
  exports: [SistemaMensagemFilaService]
})
export class SistemaMensagemFilaModule {}
