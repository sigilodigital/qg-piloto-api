import { EntitySchema } from "typeorm";

export const InteressadoSchema = new EntitySchema({
    name: "InteressadoEntity",
    columns: {
        codInteressado: {
            type: 'number',
            name: 'COD_INTERESSADO',
            length: 15
        },
        txtInteressado: {
            type: 'string',
            name: 'TXT_INTERESSADO',
            length: 200
        },
        txtCnpjCpf: {
            type: 'string',
            name: 'TXT_CNPJ_CPF',
            length: 14
        }
    },
});