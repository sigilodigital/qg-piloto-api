import { ApiProperty } from "@nestjs/swagger";
import { Validate } from 'class-validator';

import { IConstraintSchema } from "@libs/common/interfaces/ConstraintsSchema";
import { ValidaSchema } from "@libs/common/validations/valida-schema";

// TODO: concluir: add propriedades
// TODO: adicionar validadores
export class UsuarioIncluirDto implements UsuarioIncluirInputDtoType {

    @ApiProperty({ name: 'id', type: String, nullable: false, required: true, maxLength: 11 })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    id: string;

    @ApiProperty({ name: 'cpf', type: Number, nullable: false, required: true, maxLength: 11 })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    cpf: number;

    @ApiProperty({ name: 'fullname', type: String, nullable: false, required: true, maxLength: 255 })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    fullname: string;

    @ApiProperty({ name: 'email', type: String, nullable: false, maxLength: 100, required: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{ length: 100 }])
    email: string;

    @ApiProperty({ name: 'password', type: String, nullable: false, maxLength: 20, required: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    password: string;

    @ApiProperty({ name: 'isActive', type: Boolean, nullable: true, required: false, default: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    isActive: boolean;
}

type UsuarioIncluirInputDtoType = IUsuarioIncluirDto['input'];
export interface IUsuarioIncluirDto {
    input: {
        id: string;
        cpf: number;
        fullname: string;
        email: string;
        password: string;
        isActive: boolean;
    },
    output: {
        id: string;
        cpf: number;
        fullname: string;
        email: string;
        isActive: boolean;
    };
}