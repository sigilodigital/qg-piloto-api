import { PickType } from "@nestjs/swagger";

import { AvaliadorAtualizarInputDto } from "./avaliador-atualizar.dto";

export class AvaliadorRemoverInputDto extends PickType(AvaliadorAtualizarInputDto, ['id']) { }

export class AvaliadorRemoverOutputDto extends PickType(AvaliadorAtualizarInputDto, ['id', 'cpf']) { }
