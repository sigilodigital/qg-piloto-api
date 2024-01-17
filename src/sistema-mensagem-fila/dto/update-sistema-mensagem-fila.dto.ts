import { PartialType } from '@nestjs/swagger';
import { CreateSistemaMensagemFilaDto } from './create-sistema-mensagem-fila.dto';

export class UpdateSistemaMensagemFilaDto extends PartialType(CreateSistemaMensagemFilaDto) {}
