import { Column, Entity, Index } from "typeorm";

@Index("PK_TBL_ESCOLARIDADE", ["id"], { unique: true })
@Entity({ name: 'TBL_ESCOLARIDADE' })
export class EscolaridadeEntity {

    @Column('uuid', { generated: 'uuid', primary: true })
    id?: string;

    @Column("text", { name: "tipoEscolaridade", nullable: true })
    tipoEscolaridade: string | null; // GRADUACAO | ESPECIALIZACAO | MESTRADO | DOUTORADO | POS_DOUTORADO

    @Column("text", { name: "tipoGraduacao", nullable: true })
    tipoGraduacao: string | null; // BACHARELADO | LICENCIATURA | TECNOLOGO

    @Column("text", { name: "dtConclusao", nullable: true })
    dtConclusao: string | null;

    @Column("text", { name: "docName", nullable: true })
    docName: string | null;

    @Column("text", { name: "docUrl", nullable: true })
    docUrl: string | null;

    @Column("text", { name: "docHash", nullable: true })
    docHash: string | null;

    @Column("text", { name: "docMimetype", nullable: true })
    docMimetype: string | null;

    @Column("boolean", { name: "isActive", default: true })
    isActive: boolean;

}
