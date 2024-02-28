import { EntitySchema } from "typeorm"

export const AvaliadorSchema = new EntitySchema({
    name: "Avaliador",
    columns: {
        txtSenha: {
            type: String,
            name: 'TXT_SENHA',
            length: 30,
            nullable: true
        },
        txtResposta: {
            type: String,
            name: 'TXT_RESPOSTA',
            length: 50,
            nullable: true
        },
        codPerguntaSecreta: {
            type: "number",
            name: "COD_PERGUNTA_SECRETA",
            length: 1,
            nullable: true
        },
        username: {
            type: "string",
            name: "TXT_CNPJ_CPF",
            length: 14,
            nullable: true
        },
        password: {
            type: "string",
            name: "TXT_SENHA",
            length: 30,
            nullable: true
        },
        txtRazaoSocial: {
            type: "string",
            name: "TXT_RAZAO_SOCIAL",
            length: 255,
            nullable: true
        },
        txtNome: {
            type: "string",
            name: "TXT_NOME",
            length: 255,
            nullable: true
        },
        txtEmail: {
            type: "string",
            name: "TXT_EMAIL",
            length: 100,
            nullable: false
        },
        txtContador: {
            type: "string",
            name: "TXT_CONTADOR",
            length: 255,
            nullable: true
        },
        codAvaliador: {
            type: "number",
            name: "COD_AVALIADOR_EXTERNO",
            length: 20,
            nullable: true
        },
        codTipoLembranca: {
            type: "number",
            name: "COD_TIPO_LEMBRANCA",
            length: 255,
            nullable: true
        },
        codTermo: {
            type: "number",
            name: "COD_TERNO",
            length: 20,
            nullable: true
        },
        codTentativaPergunta: {
            type: "number",
            name: "COD_TENTATIVA_PERGUNTA",
            length: 255,
            nullable: true
        },
        codSenhaIncorreta: {
            type: "number",
            name: "COD_SENHA_INCORRETA",
            length: 20,
            nullable: true
        },
        codSenhaBloqueada: {
            type: "number",
            name: "COD_SENHA_BLOQUEADA",
            length: 20,
            nullable: true
        },
        codSenhaAlterada: {
            type: "number",
            name: "COD_SENHA_ALTERADA",
            length: 20,
            nullable: true
        },
        codPerSctBloqueada: {
            type: "number",
            name: "COD_PER_SCT_BLOQUEADA",
            length: 20,
            nullable: true
        },
        codNewsletter: {
            type: "number",
            name: "COD_NEWS_LETTER",
            length: 20,
            nullable: true
        },
        codAtivo: {
            type: "number",
            name: "COD_ATIVO",
            length: 20,
            nullable: true,
            default: [0, 1]
        },
        codInteressado: {
            type: "number",
            name: "COD_INTERESSADO",
            length: 20,
            nullable: true
        }
    },
})


