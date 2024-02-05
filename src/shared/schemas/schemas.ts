import { LoginSistemaSchema } from "src/auth/models/schemas/loginSistemaWS.schema";
import { LoginUserSchema } from "src/auth/models/schemas/loginUser.schema";
import { PerguntaSecretaSchema } from "src/auth/models/schemas/perguntaSecreta.schema";
import { InteressadoSchema } from "src/interessado/schema/interessado.schema";
import { UsuarioExternoSchema } from "src/usuario-externo/schema/usuario-externo.schema";
import { EntitySchema } from "typeorm";
import { UsuarioExternoSenhaPerguntaSecretaRecuperarSchema } from './../../recuperacao-senha/schema/usuario-externo-senha-pergunta-secreta-recuperar.schema';
import { UsuarioExternoSenhaEmailRecuperarSchema } from '../../recuperacao-senha/schema/usuario-externo-senha-email-recuperar.schema';
import { UsuarioExternoSenhaAlterarSchema } from "src/recuperacao-senha/schema/usuario-externo-senha-alterar.schema";
import { UsuarioExternoLembracaSenhaConsultarSchema } from "src/recuperacao-senha/schema/usuario-externo-lembranca-senha-consultar.schema";

export interface ISchema {
    name: string;
    schema: EntitySchema;
}

export class Schemas {

    static schemaList(schemaName?: string): Promise<ISchema> {
        const schemaList = [];
        schemaList.push({ name: 'InteressadoEntity', schema: InteressadoSchema });
        schemaList.push({ name: 'UsuarioExterno', schema: UsuarioExternoSchema });
        schemaList.push({ name: 'LoginSistema', schema: LoginSistemaSchema });
        schemaList.push({ name: 'LoginUser', schema: LoginUserSchema });
        schemaList.push({ name: 'PerguntaSecretaDto', schema: PerguntaSecretaSchema });
        schemaList.push({ name: 'UsuarioExternoSenhaPerguntaSecretaRecuperar', schema: UsuarioExternoSenhaPerguntaSecretaRecuperarSchema });
        schemaList.push({ name: 'UsuarioExternoSenhaEmailRecuperar', schema: UsuarioExternoSenhaEmailRecuperarSchema });
        schemaList.push({ name: 'UsuarioExternoSenhaAlterar', schema: UsuarioExternoSenhaAlterarSchema });
        schemaList.push({ name: 'UsuarioExternoLembracaSenhaConsultar', schema: UsuarioExternoLembracaSenhaConsultarSchema });

        if (schemaName) {
            for (const element of schemaList) {
                if (element['name'] === schemaName) {
                    return element;
                }
            }
        } else return;

    }

}