import { ApiProperty } from "@nestjs/swagger";
import { Validate } from "class-validator";
import { ApiResponse } from "@libs/common/services/response-handler";
import { ValidaCampoPorSchema } from "src/shared/validation/classes/validaCampoPorSchema";

export interface IUsuarioExternoSenhaAlterar {
    input: {
        txtEmail: string;
        codInteressado: number;
        txtSenhaAtual: string;
        txtSenhaNova: string;
    },
    output: {
        reponseHandler: ApiResponse
    }
}

export class UsuarioExternoSenhaAlterar {

    @ApiProperty({ name: 'codInteressado', type: Number, })
    @Validate(ValidaCampoPorSchema)
    codInteressado: number;

    @ApiProperty({ name: 'txtSenhaAtual', type: String })
    @Validate(ValidaCampoPorSchema)
    txtSenhaAtual: string;

    @ApiProperty({ name: 'txtSenhaNova', type: String })
    @Validate(ValidaCampoPorSchema)
    txtSenhaNova: string;
}