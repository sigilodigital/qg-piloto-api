import { ApiProperty } from "@nestjs/swagger";
import { Column } from "typeorm";
import { Validate } from 'class-validator';
import { ValidaSchema } from "@libs/common/validations/valida-schema";
import { IConstraintSchema } from "@libs/common/interfaces/ConstraintsSchema";

// TODO: adicionar validadores
export class UsuarioConsultarDto implements UsuarioConsultarInputDtoType {
    
    @ApiProperty({ name: 'id', type: String })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    id: string;
    
    @ApiProperty({ name: 'cpf', type: Number })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    cpf: number;

    @ApiProperty({ name: 'fullname', type: String })
    fullname: string | null;

    @ApiProperty({ name: 'email', type: String })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    email: string;

    @ApiProperty({ name: 'isActive', type: Boolean })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    isActive: boolean;
}

type UsuarioConsultarInputDtoType = IUsuarioConsultarDto['input'];
export interface IUsuarioConsultarDto {
    input: {
        id: string;
        cpf: number;
        fullname: string;
        email: string;
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