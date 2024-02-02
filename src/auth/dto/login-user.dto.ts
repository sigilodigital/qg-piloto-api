import { ApiProperty } from "@nestjs/swagger";
import { Validate } from "class-validator";
import { ValidaCampoPorSchema } from 'src/shared/validation/classes/validaCampoPorSchema';
import { ValidaTamanhoCnpjCpf } from "src/shared/validation/classes/validaTamanhoCnpjCpf";
import { ValidaCnpjCpf } from 'src/shared/validation/classes/validaCnpjCpf';
import { ValidaSchema } from "src/shared/validation/classes/valida-schema";
import { IConstraintSchema } from "@libs/common/interfaces/ConstraintsSchema";

// export interface ISistemaWS {
//     codSegSistemaWs: number;
//     txtSegSistemaWs: string;
//     txtLogin: string;
//     txtSenha: string;
//     codAtivo: number;
// }

// export interface ISistemaMetodoWS {
//     codSegSistemaWs: number;
//     codSegMetodoWs: number;
// }

// export interface ILoginPessoa {
//     input: {
//         txtCnpjCpf: string;
//         txtSenha: string;
//     };

//     output: {
//         codUsuarioExterno: number;
//         codInteressado: number;
//         txtInteressado: string;
//         txtCnpjCpf: string;
//         txtNomeSocial?: string;
//         txtRazaoSocial?: string;
//     };
// }

export class LoginUser {

    @ApiProperty({ name: 'username', type: String })
    @Validate(ValidaCnpjCpf)
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'string', orLength: [11, 14] }])
    username: string;

    @ApiProperty({ name: 'password', type: String })
    @Validate(ValidaCampoPorSchema)
    password: string;

}