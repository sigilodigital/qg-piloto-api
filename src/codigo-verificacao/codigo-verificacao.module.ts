import { Module } from '@nestjs/common';
import { CodigoVerificacaoService } from './codigo-verificacao.service';
import { CodigoVerificacaoController } from './codigo-verificacao.controller';

@Module({
  controllers: [CodigoVerificacaoController],
  providers: [CodigoVerificacaoService]
})
export class CodigoVerificacaoModule {}
