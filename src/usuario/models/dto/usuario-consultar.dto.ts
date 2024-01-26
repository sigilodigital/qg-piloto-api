import { ApiProperty } from "@nestjs/swagger";
import { Validate } from 'class-validator';

import { IConstraintSchema } from "@libs/common/interfaces/ConstraintsSchema";
import { ValidaSchema } from "@libs/common/validations/valida-schema";

// TODO: adicionar validadores
export class UsuarioConsultarInputDto {
    
    @ApiProperty({ name: 'id', type: String, required: false })
    // @Validate(ValidaSchema, [<IConstraintSchema>{}])
    id?: string;
    
    @ApiProperty({ name: 'cpf', type: Number, required: false })
    // @Validate(ValidaSchema, [<IConstraintSchema>{}])
    cpf?: number;

    @ApiProperty({ name: 'fullname', type: String, required: false })
    // @Validate(ValidaSchema, [<IConstraintSchema>{}])
    fullname?: string | null;

    // @ApiProperty({ name: 'genero', type: String, required: false })
    // genero: string | null;

    // @ApiProperty({ name: 'estadoCivil', type: String, required: false })
    // estadoCivil: string | null;

    // @ApiProperty({ name: 'dtNascimento', type: Date, required: false })
    // dtNascimento: string | null;

    // @ApiProperty({ name: 'descricao', type: String, required: false })
    // descricao: string | null;

    // @ApiProperty({ name: 'contact', type: ContactOutputDto, required: false })
    // contact: ContactOutputDto;

    // @ApiProperty({ name: 'loginInfo', type: LoginInfoOutputDto, required: false })
    // loginInfo: LoginInfoOutputDto;

    // @ApiProperty({ name: 'dataAccess', type: DataAccessOutputDto, required: false })
    // dataAccess: DataAccessOutputDto;

    @ApiProperty({ name: 'email', type: String, required: false })
    // @Validate(ValidaSchema, [<IConstraintSchema>{}])
    email?: string;

    @ApiProperty({ name: 'isActive', type: Boolean, required: false })
    // @Validate(ValidaSchema, [<IConstraintSchema>{}])
    isActive?: boolean;
}

export class UsuarioConsultarOutputDto {
    
    @ApiProperty({ name: 'id', type: String })
    id: string;
    
    @ApiProperty({ name: 'cpf', type: Number })
    cpf: number;

    @ApiProperty({ name: 'fullname', type: String })
    fullname: string | null;

    // @ApiProperty({ name: 'genero', type: String })
    // genero: string | null;

    // @ApiProperty({ name: 'estadoCivil', type: String })
    // estadoCivil: string | null;

    // @ApiProperty({ name: 'dtNascimento', type: Date })
    // dtNascimento: string | null;

    // @ApiProperty({ name: 'descricao', type: String })
    // descricao: string | null;

    // @ApiProperty({ name: 'contact', type: ContactOutputDto })
    // contact: ContactOutputDto;

    // @ApiProperty({ name: 'loginInfo', type: LoginInfoOutputDto })
    // loginInfo: LoginInfoOutputDto;

    // @ApiProperty({ name: 'dataAccess', type: DataAccessOutputDto })
    // dataAccess: DataAccessOutputDto;

    @ApiProperty({ name: 'email', type: String })
    email: string;

    @ApiProperty({ name: 'isActive', type: Boolean })
    isActive: boolean;
}
