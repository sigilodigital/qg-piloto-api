import { PartialType } from '@nestjs/swagger';
import { UsuarioIncluirInputDto } from './usuario-incluir.dto';

export class UsuarioAtualizarDto extends PartialType(UsuarioIncluirInputDto) {}
