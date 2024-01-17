import { EntitySchema } from "typeorm"

export const UsuarioExternoLembracaSenhaConsultarSchema = new EntitySchema({
    name: "UsuarioExternoLembracaSenhaConsultar",
    columns: {
        codInteressado: {
            type: 'number',
            name: 'COD_INTERESSADO',
            length: 15,
            nullable: false
        }
    },
})