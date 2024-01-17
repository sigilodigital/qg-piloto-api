import { EntitySchema } from "typeorm"

export const UsuarioExternoSenhaAlterarSchema = new EntitySchema({
    name: "UsuarioExternoSenhaAlterar",
    columns: {
        codInteressado: {
            type: 'number',
            name: 'COD_INTERESSADO',
            length: 30,
            nullable: false
        },
        txtSenhaAtual: {
            type: 'string',
            name: 'txtSenhaAtual',
            length: 30,
            nullable: false
        },
        txtSenhaNova: {
            type: 'string',
            name: 'txtSenhaNova',
            length: 30,
            nullable: false
        }
    },
})