import { Column, Entity, Index, ManyToMany, OneToMany } from "typeorm";

import { SistemaMetodoEntity } from "./sistema-metodo.entity";
import { SistemaEntity } from "./sistema.entity";

@Index("PK_TBL_METODO", ["id"], { unique: true })
@Entity("TBL_METODO")
export class MetodoEntity {

    @Column("uuid", { primary: true, generated: 'uuid' })
    id: string;

    @Column("varchar2", { length: 50 })
    nome: string;

    @Column("varchar2", { length: 255 })
    descricao: string;

    @Column("boolean", { name: "seAtivo", default: false })
    seAtivo?: boolean;

    @ManyToMany(type => SistemaEntity, e => e._metodoList)
    _sistemaList: SistemaEntity;

    @OneToMany(type => SistemaMetodoEntity, e => e._metodo, { lazy: true })
    _sistemaMetodoList: SistemaMetodoEntity;
}