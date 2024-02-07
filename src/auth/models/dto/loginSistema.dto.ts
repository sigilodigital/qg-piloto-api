import { IConstraintSchema } from "@libs/common/interfaces/ConstraintsSchema";
import { ApiProperty } from "@nestjs/swagger";
import { Validate } from "class-validator";
import { ValidaSchema } from "src/shared/validation/classes/valida-schema";
import { SistemaEntity } from "../entities/sistema.entity";
import { MetodoEntity } from "../entities/metodo.entity";

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