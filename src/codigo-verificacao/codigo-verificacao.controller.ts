import { Body, Controller, Post } from '@nestjs/common';

import { CodigoVerificacaoService } from './codigo-verificacao.service';
import { ICreateCodigoVerificacaoDto } from './dto/create-codigo-verificacao.dto';

@Controller('codigo-verificacao')
export class CodigoVerificacaoController {
  constructor(private readonly codigoVerificacaoService: CodigoVerificacaoService) {}

  @Post('registrar')
  create(@Body() createCodigoVerificacaoDto: ICreateCodigoVerificacaoDto['input']) {
    return this.codigoVerificacaoService.create(createCodigoVerificacaoDto);
  }

  @Post('validar')
  validar(@Body() createCodigoVerificacaoDto: ICreateCodigoVerificacaoDto['input']) {
    return this.codigoVerificacaoService.validar(createCodigoVerificacaoDto);
  }

}
