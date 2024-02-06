import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany } from "typeorm";

import { MetodoEntity } from "./metodo.entity";
import { SistemaMetodoEntity } from "./sistema-metodo.entity";

@Index("PK_TBL_SISTEMA", ["id"], { unique: true })
@Entity("TBL_SISTEMA")
export class SistemaEntity {
    @Column("uuid", { primary: true, generated: 'uuid' })
    id: string;

    @Column("varchar2", { name: "nome", length: 100 })
    nome: string;

    @Column("varchar2", { name: "username", length: 50 })
    username: string;

    @Column("varchar2", { name: "password", length: 30 })
    password: string;

    @Column("varchar2", { name: "descricao", length: 500 })
    descricao: string;

    @Column("boolean", { name: "seAtivo", default: false })
    seAtivo?: boolean;

    @ManyToMany(type => MetodoEntity, e => e._sistemaList, { lazy: true })
    @JoinTable()
    _metodoList: MetodoEntity;

    @OneToMany(type => SistemaMetodoEntity, e => e._sistema, { lazy: true })
    _sistemaMetodoList: SistemaMetodoEntity;
}
