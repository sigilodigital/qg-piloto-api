import { ApiProperty } from "@nestjs/swagger";
import { Validate } from "class-validator";
import { ValidaCampoPorSchema } from "src/shared/validation/classes/validaCampoPorSchema";
import { ValidaCnpjCpf } from 'src/shared/validation/classes/validaCnpjCpf';

export interface IUsuarioExternoSenhaEmailRecuperar {
    input: {

        txtCnpjCpf: string;
        txtEmail: string;
    },
    output: {
        codInteressado: number;
        txtCnpjCpf: string;
    };
}

export class UsuarioExternoSenhaEmailRecuperar {

    @ApiProperty({ name: 'txtCnpjCpf', type: String, })
    @Validate(ValidaCnpjCpf)
    @Validate(ValidaCampoPorSchema)
    txtCnpjCpf: string;

    @ApiProperty({ name: 'txtEmail', type: String })
    @Validate(ValidaCampoPorSchema)
    txtEmail: string;
}