import { IConstraintSchema } from "@libs/common/interfaces/ConstraintsSchema";
import { ApiProperty } from "@nestjs/swagger";
import { Validate } from "class-validator";
import { SistemaEntity } from "../entities/sistema.entity";
import { MetodoEntity } from "../entities/metodo.entity";
import { ValidaSchema } from "@sd-root/libs/common/src/validations/valida-schema";

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

export class LoginSistemaInputDto {
    
    @ApiProperty({ name: "txtLogin", type: String, required: true, description: "Nome do usuário do sistema." })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'string', maxLength: 50 }])
    username: string;

    @ApiProperty({ name: "txtSenha", type: String, required: true, description: "Senha do usuário do sistema." })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'string', maxLength: 50 }])
    password: string;

}
export class LoginSistemaOutputDto {
    
    sistema: SistemaEntity;
    metodoList: MetodoEntity[];
    token?: string;
}