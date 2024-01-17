import { PartialType } from '@nestjs/swagger';
import { CreateUsuarioExternoDto } from './create-usuario-externo.dto';

export class UpdateUsuarioExternoDto extends PartialType(CreateUsuarioExternoDto) {}
