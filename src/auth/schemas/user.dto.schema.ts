import { EntitySchema } from "typeorm";

export const UserDtoSchema = new EntitySchema({
    name: "UserDto",
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