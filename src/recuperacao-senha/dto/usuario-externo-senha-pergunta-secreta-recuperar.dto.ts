import { ApiProperty } from "@nestjs/swagger";
import { Validate } from "class-validator";
import { ValidaCampoPorSchema } from 'src/shared/validation/classes/validaCampoPorSchema';
import { ValidaCnpjCpf } from 'src/shared/validation/classes/validaCnpjCpf';
import { ValidaTamanhoCnpjCpf } from 'src/shared/validation/classes/validaTamanhoCnpjCpf';
import { ValidaPerguntaSecretaExistente } from 'src/shared/validation/classes/validaPerguntaSecretaExistente';
import { ApiResponse } from './../../shared/response-handler';

export type UsuarioExternoSenhaPerguntaSecretaRecuperarType = IUsuarioExternoSenhaPerguntaSecretaRecuperar['input'];

export interface IUsuarioExternoSenhaPerguntaSecretaRecuperar {
    input: {
        txtCnpjCpf: string;
        codPerguntaSecreta: number;
        txtRespostaSecreta: string;
        txtSenhaNova: string;
    },
    output: {
        reponseHandler: ApiResponse;
    };
}

export class UsuarioExternoSenhaPerguntaSecretaRecuperar implements UsuarioExternoSenhaPerguntaSecretaRecuperarType{

    @ApiProperty({
        name: 'txtCnpjCpf',
        type: String,
        required: true
    })
    @Validate(ValidaCnpjCpf)
    @Validate(ValidaTamanhoCnpjCpf)
    @Validate(ValidaCampoPorSchema)
    txtCnpjCpf: string;

    @ApiProperty({
        name: 'codPerguntaSecreta',
        type: Number,
        required: true
    })
    @Validate(ValidaPerguntaSecretaExistente)
    @Validate(ValidaCampoPorSchema)
    codPerguntaSecreta: number;

    @ApiProperty({
        name: 'txtRespostaSecreta',
        type: String,
        required: true
    })
    @Validate(ValidaCampoPorSchema)
    txtRespostaSecreta: string;

    @ApiProperty({
        name: 'txtSenhaNova',
        type: String,
        required: true
    })
    @Validate(ValidaCampoPorSchema)
    txtSenhaNova: string;
}