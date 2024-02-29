import { Column, Entity, Index } from "typeorm";

@Index("PK_TBL_AVALIADOR", ["id"], { unique: true })
@Entity({ name: 'TBL_AVALIADOR' })
export class AvaliadorEntity {

    @Column('uuid', { generated: 'uuid', primary: true })
    id?: string;

    @Column("varchar", { name: "nacionalidade", nullable: true })
    nacionalidade?: string | null;

    @Column("varchar", { name: "naturalidade", nullable: true })
    naturalidade?: string | null;

    @Column("text", { name: "nomeMae", nullable: true })
    nomeMae?: string | null;

    @Column("text", { name: "nomePai", nullable: true })
    nomePai?: string | null;

    @Column("bigint", { name: "cpf", unique: true })
    cpf: number;

    @Column("boolean", { name: "isActive", default: true })
    isActive: boolean;

}
