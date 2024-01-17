import { PartialType } from '@nestjs/swagger';
import { UsuarioIncluirDto } from './usuario-incluir.dto';

export class UsuarioAtualizarDto extends PartialType(UsuarioIncluirDto) {}
