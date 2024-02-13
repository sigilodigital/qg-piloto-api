import { PickType } from "@nestjs/swagger";

import { UsuarioAtualizarInputDto } from "./usuario-atualizar.dto";

export class UsuarioRemoverInputDto extends PickType(UsuarioAtualizarInputDto, ['id']) { }

export class UsuarioRemoverOutputDto extends PickType(UsuarioAtualizarInputDto, ['id', 'cpf']) { }
