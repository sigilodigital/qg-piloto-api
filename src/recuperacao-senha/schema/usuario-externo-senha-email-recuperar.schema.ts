import { EntitySchema } from "typeorm"

export const UsuarioExternoSenhaEmailRecuperarSchema = new EntitySchema({
    name: "UsuarioExternoSenhaEmailRecuperar",
    columns: {

        txtCnpjCpf: {
            type: 'string',
            name: 'TXT_CNPJ_CPF',
            length: 14,
            nullable: false
        },
        txtEmail: {
            type: 'string',
            name: 'TXT_EMAIL',
            length: 30,
            nullable: false
        }
    },
})