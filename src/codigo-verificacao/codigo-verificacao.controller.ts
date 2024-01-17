import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CodigoVerificacaoService } from './codigo-verificacao.service';
import { ICreateCodigoVerificacaoDto } from './dto/create-codigo-verificacao.dto';
import { UpdateCodigoVerificacaoDto } from './dto/update-codigo-verificacao.dto';

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

  @Get()
  findAll() {
    return this.codigoVerificacaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.codigoVerificacaoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCodigoVerificacaoDto: UpdateCodigoVerificacaoDto) {
    return this.codigoVerificacaoService.update(+id, updateCodigoVerificacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.codigoVerificacaoService.remove(+id);
  }
}
