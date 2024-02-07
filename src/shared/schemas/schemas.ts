import { LoginSistemaSchema } from "src/auth/models/schemas/loginSistemaWS.schema";
import { LoginUserSchema } from "src/auth/models/schemas/loginUser.schema";
import { PerguntaSecretaSchema } from "src/auth/models/schemas/perguntaSecreta.schema";
import { EntitySchema } from "typeorm";

export interface ISchema {
    name: string;
    schema: EntitySchema;
}

export class Schemas {

    static schemaList(schemaName?: string): Promise<ISchema> {
        const schemaList = [];
        schemaList.push({ name: 'LoginSistema', schema: LoginSistemaSchema });
        schemaList.push({ name: 'LoginUser', schema: LoginUserSchema });
        schemaList.push({ name: 'PerguntaSecretaDto', schema: PerguntaSecretaSchema });

        if (schemaName) {
            for (const element of schemaList) {
                if (element['name'] === schemaName) {
                    return element;
                }
            }
        } else return;

    }

}