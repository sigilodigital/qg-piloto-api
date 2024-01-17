import { EntitySchema } from "typeorm";

export const LoginSistemaSchema = new EntitySchema({
    name: "LoginSistema",
    columns: {
        txtLogin: {
            type: 'string',
            name: 'TXT_LOGIN',
            length: 30
        },
        txtSenha: {
            type: 'string',
            name: 'TXT_SENHA',
            length: 30
        }
    },
});