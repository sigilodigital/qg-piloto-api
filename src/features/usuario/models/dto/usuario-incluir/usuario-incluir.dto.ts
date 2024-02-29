import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Validate, ValidateNested } from 'class-validator';

import { IConstraintSchema } from "@sd-root/libs/common/src/models/interfaces/ConstraintsSchema";
import { ValidaSchema } from "@libs/common/validations/valida-schema";
import { ContatoInputDto } from "./contato.dto";
import { UsuarioEntity } from "../../entities/usuario.entity";
import { DataAccessEntity } from "../../entities/data-access.entity";
import { DataAccessInputDto } from "./data-access.dto";

// TODO: concluir: add propriedades
// TODO: adicionar validadores
export class UsuarioIncluirInputDto implements UsuarioEntity {

    @ApiProperty({ name: 'cpf', type: Number, nullable: false, required: true, maxLength: 11 })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'number', nullable: false, length: 11 }])
    cpf: number;

    @ApiProperty({ name: 'fullname', type: String, nullable: false, required: true, maxLength: 255 })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    fullname: string;

    @ApiProperty({ name: 'socialname', type: String, nullable: true, required: false, maxLength: 255 })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    socialname?: string | null;

    @ApiProperty({ name: '_contato', type: ContatoInputDto, nullable: false, required: true, maxLength: 100 })
    @ValidateNested()
    _contato?: ContatoInputDto;

    @ApiProperty({ name: '_dataAccess', type: DataAccessInputDto, nullable: false, required: true, maxLength: 20 })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    _dataAccess?: DataAccessInputDto;

    @ApiProperty({ name: 'isActive', type: Boolean, nullable: true, required: false, default: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'boolean', nullable: true }])
    isActive: boolean;
}

export class UsuarioIncluirOutputDto extends OmitType(UsuarioIncluirInputDto, ['_dataAccess']) { }