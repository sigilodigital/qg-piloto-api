import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Validate } from 'class-validator';

import { IConstraintSchema } from '@sd-root/libs/common/src/models/interfaces/ConstraintsSchema';
import { ValidaSchema } from '@sd-root/libs/common/src/validations/schema.validate';
import { UsuarioIncluirInputDto, UsuarioIncluirOutputDto } from './usuario-incluir/usuario-incluir.dto';

export class UsuarioAtualizarInputDto extends PartialType(UsuarioIncluirInputDto) {

    @ApiProperty({ name: 'id', type: String, nullable: false, required: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'string' }])
    id: string;
}

export class UsuarioAtualizarOutputDto extends OmitType(UsuarioIncluirOutputDto, []) { }