import { PartialType } from "@nestjs/swagger";

import { UsuarioAtualizarInputDto, UsuarioAtualizarOutputDto } from "./usuario-atualizar.dto";
import { UsuarioIncluirOutputDto } from "./usuario-incluir/usuario-incluir.dto";

// TODO: adicionar validadores
export class UsuarioConsultarInputDto extends PartialType(UsuarioAtualizarInputDto) { }

export class UsuarioConsultarOutputDto extends PartialType(UsuarioAtualizarOutputDto) { }
