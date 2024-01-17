import { ApiProperty } from "@nestjs/swagger";
import { Column } from "typeorm";
import { Validate } from 'class-validator';
import { ValidaSchema } from "@libs/common/validations/valida-schema";
import { IConstraintSchema } from "@libs/common/interfaces/ConstraintsSchema";
import { UsuarioEntity } from "../entities/usuario.entity";

// TODO: concluir: add propriedades
// TODO: adicionar validadores
export class UsuarioIncluirDto implements UsuarioIncluirInputDtoType {

    @ApiProperty({ name: 'cpf', type: String, nullable: false, required: true, maxLength: 11 })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    @Column("varchar2", { name: "cpf", nullable: false, length: 11 })
    cpf: number;

    @ApiProperty({ name: 'fullname', type: String, nullable: false, required: true, maxLength: 255 })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    @Column("varchar2", { name: "fullname", nullable: false, length: 255 })
    fullname: string;

    @ApiProperty({ name: 'email', type: String, nullable: false, maxLength: 100, required: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{ length: 100 }])
    @Column("varchar2", { name: "email", length: 100 })
    email: string;

    @ApiProperty({ name: 'password', type: String, nullable: false, maxLength: 20, required: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    @Column("varchar2", { name: "password", length: 20 })
    password: string;

    @ApiProperty({ name: 'isActive', type: Boolean, nullable: true, required: false, default: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    @Column("boolean", { name: "isActive", default: () => true })
    isActive: boolean;
}

type UsuarioIncluirInputDtoType = IUsuarioIncluirDto['input'];
export interface IUsuarioIncluirDto {
    input: {
        cpf: number;
        fullname: string;
        email: string;
        password: string;
        isActive: boolean;
    },
    output: null;
}