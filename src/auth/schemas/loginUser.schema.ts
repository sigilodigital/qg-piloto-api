import { EntitySchema } from "typeorm";

export const LoginUserSchema = new EntitySchema({
    name: "LoginUser",
    columns: {
        txtCnpjCpf: {
            type: 'string',
            name: 'TXT_CNPJ_CPF',
            length: 14,
            nullable: false
        },
        txtSenha: {
            type: 'string',
            name: 'TXT_SENHA',
            length: 30,
            nullable: false
        }
    },
});