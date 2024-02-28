import { ApiProperty, PartialType } from "@nestjs/swagger";

import { LoginInfoEntity } from "../entities/login-info.entity";
import { AvaliadorAtualizarInputDto, AvaliadorAtualizarOutputDto } from "./avaliador-atualizar.dto";

// TODO: adicionar validadores
export class AvaliadorConsultarInputDto extends PartialType(AvaliadorAtualizarInputDto) {
    @ApiProperty({ name: '_loginInfo', type: LoginInfoEntity })
    _loginInfo?: LoginInfoEntity;
}

export class AvaliadorConsultarOutputDto extends PartialType(AvaliadorAtualizarOutputDto) {
    @ApiProperty({ name: '_loginInfo', type: LoginInfoEntity })
    _loginInfo?: LoginInfoEntity;
}
