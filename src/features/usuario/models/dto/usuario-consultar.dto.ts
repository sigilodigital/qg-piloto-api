import { ApiProperty, PartialType } from "@nestjs/swagger";

import { LoginInfoEntity } from "../entities/login-info.entity";
import { UsuarioAtualizarInputDto, UsuarioAtualizarOutputDto } from "./usuario-atualizar.dto";

// TODO: adicionar validadores
export class UsuarioConsultarInputDto extends PartialType(UsuarioAtualizarInputDto) {
    @ApiProperty({ name: '_loginInfo', type: LoginInfoEntity })
    _loginInfo?: LoginInfoEntity;
}

export class UsuarioConsultarOutputDto extends PartialType(UsuarioAtualizarOutputDto) {
    @ApiProperty({ name: '_loginInfo', type: LoginInfoEntity })
    _loginInfo?: LoginInfoEntity;
}
