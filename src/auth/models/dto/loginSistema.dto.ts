import { IConstraintSchema } from "@libs/common/interfaces/ConstraintsSchema";
import { ApiProperty } from "@nestjs/swagger";
import { Validate } from "class-validator";
import { ValidaSchema } from "src/shared/validation/classes/valida-schema";

export interface ISistemaWS {
    codSegSistemaWs: number;
    txtSegSistemaWs: string;
    txtLogin: string;
    txtSenha: string;
    codAtivo: number;
}

export interface ISistemaMetodoWS {
    codSegSistemaWs: number;
    codSegMetodoWs: number;
}

export interface ILoginSystem {
    input: {
        txtLogin: string;
        txtSenha: string;
    },
    output: {
        sistema: ISistemaWS,
        sistemaMetodo: ISistemaMetodoWS;
    };

}
export class LoginSistema {
    
    @ApiProperty({ name: "txtLogin", type: String, required: true, description: "Nome do usuário do sistema." })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'string', maxLength: 50 }])
    txtLogin: string;

    @ApiProperty({ name: "txtSenha", type: String, required: true, description: "Senha do usuário do sistema." })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'string', maxLength: 50 }])
    txtSenha: string;

}