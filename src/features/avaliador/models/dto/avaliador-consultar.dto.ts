import { PartialType } from "@nestjs/swagger";

import { AvaliadorAtualizarInputDto, AvaliadorAtualizarOutputDto } from "./avaliador-atualizar.dto";

// TODO: adicionar validadores
export class AvaliadorConsultarInputDto extends PartialType(AvaliadorAtualizarInputDto) { }

export class AvaliadorConsultarOutputDto extends PartialType(AvaliadorAtualizarOutputDto) { }
