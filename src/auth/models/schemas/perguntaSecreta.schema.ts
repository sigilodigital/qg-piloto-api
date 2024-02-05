import { EntitySchema } from "typeorm"

export const PerguntaSecretaSchema = new EntitySchema({
    name: "PerguntaSecretaDto",
    columns: {
        codInteressado: {
            type: 'number',
            name: 'COD_INTERESSADO',
            length: 15,
            nullable: false
        },
        codTipoLembrancaSenha: {
            type: 'number',
            name: 'COD_TIPO_LEMBRANCA',
            length: 1,
            default: [0, 1],
            nullable: true
        },
        codPerguntaSecreta: {
            type: 'number',
            name: 'COD_PERGUNTA_SECRETA',
            length: 3,
            nullable: false
        },
        txtRespostaPerguntaSecreta: {
            type: 'string',
            name: 'TXT_RESPOSTA_PERGUNTA_SECRETA',
            length: 50,
            nullable: true
        },
    },
})