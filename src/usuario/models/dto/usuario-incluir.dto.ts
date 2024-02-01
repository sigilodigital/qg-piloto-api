import { ApiProperty } from "@nestjs/swagger";
import { Validate } from 'class-validator';

import { IConstraintSchema } from "@libs/common/interfaces/ConstraintsSchema";
import { ValidaSchema } from "@libs/common/validations/valida-schema";
import { EmailEntity } from "../entities/email.entity";
import { ContatoEntity } from "../entities/contato.entity";

// TODO: concluir: add propriedades
// TODO: adicionar validadores
export class UsuarioIncluirInputDto {

    @ApiProperty({ name: 'id', type: String, nullable: false, required: true, maxLength: 11 })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    id?: string;

    @ApiProperty({ name: 'cpf', type: Number, nullable: false, required: true, maxLength: 11 })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    cpf: number;

    @ApiProperty({ name: 'fullname', type: String, nullable: false, required: true, maxLength: 255 })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    fullname: string;

    @ApiProperty({ name: 'contato', type: EmailEntity, nullable: false, maxLength: 100, required: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{ length: 100 }])
    _contato: ContatoEntity;

    @ApiProperty({ name: 'password', type: String, nullable: false, maxLength: 20, required: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    password: string;

    @ApiProperty({ name: 'isActive', type: Boolean, nullable: true, required: false, default: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    isActive: boolean;
}

export class UsuarioIncluirOutputDto {

    @ApiProperty({ name: 'id', type: String, nullable: false, required: true, maxLength: 11 })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    id?: string;

    @ApiProperty({ name: 'cpf', type: Number, nullable: false, required: true, maxLength: 11 })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    cpf: number;

    @ApiProperty({ name: 'fullname', type: String, nullable: false, required: true, maxLength: 255 })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    fullname: string;

    @ApiProperty({ name: 'contato', type: EmailEntity, nullable: false, maxLength: 100, required: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{ length: 100 }])
    _contato: ContatoEntity;

    @ApiProperty({ name: 'isActive', type: Boolean, nullable: true, required: false, default: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    isActive: boolean;
}
