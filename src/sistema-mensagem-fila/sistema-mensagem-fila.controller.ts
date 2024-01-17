import { Body, Controller, Post } from '@nestjs/common';
import { SistemaMensagemFilaDto } from './dto/sistema-mensagem-fila.dto';
import { SistemaMensagemFilaService } from './sistema-mensagem-fila.service';

@Controller('sistema-mensagem-fila')
export class SistemaMensagemFilaController {
  constructor(private readonly sistemaMensagemFilaService: SistemaMensagemFilaService) {}

  @Post()
  create(@Body() sistemaMensagemFilaDto: SistemaMensagemFilaDto) {
    // return this.sistemaMensagemFilaService.create(sistemaMensagemFilaDto);
  }

}
