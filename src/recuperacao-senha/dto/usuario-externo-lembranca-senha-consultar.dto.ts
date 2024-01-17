import { ApiProperty } from "@nestjs/swagger";
import { Validate } from "class-validator";
import { ValidaCampoPorSchema } from 'src/shared/validation/classes/validaCampoPorSchema';

export interface IUsuarioExternoLembracaSenhaConsultar {
    input: {
        txtEmail: string;
        codInteressado: number;
    },
    output: {
        codTipoLembrancaSenha: number;
        codPerguntaSecreta: number;
        txtRespostaPerguntaSecreta: string;
    };
}

export class UsuarioExternoLembracaSenhaConsultar {

    @ApiProperty({
        name: 'codInteressado',
        type: Number,
    })
    @Validate(ValidaCampoPorSchema)
    codInteressado: number;
}