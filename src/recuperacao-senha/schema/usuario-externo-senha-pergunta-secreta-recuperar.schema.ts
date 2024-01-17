import { EntitySchema } from "typeorm"

export const UsuarioExternoSenhaPerguntaSecretaRecuperarSchema = new EntitySchema({
    name: "UsuarioExternoSenhaPerguntaSecretaRecuperar",
    columns: {
        txtCnpjCpf: {
            type: "string",
            name: 'TXT_CNPJ_CPF',
            length: 14,
            nullable: false
        },
        codPerguntaSecreta: {
            type: "number",
            name: 'COD_PERGUNTA_SECRETA',
            length: 4,
            nullable: false
        },
        txtRespostaSecreta: {
            type: "string",
            name: 'TXT_RESPOSTA_SECRETA',
            length: 100,
            nullable: false
        },
        txtSenhaNova: {
            type: "string",
            name: 'txtSenhaNova',
            length: 30,
            nullable: false
        }
    },
})