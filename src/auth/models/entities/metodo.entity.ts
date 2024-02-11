import { Column, Entity, Index, ManyToMany, OneToMany } from "typeorm";

import { SistemaMetodoEntity } from "./sistema-metodo.entity";
import { SistemaEntity } from "./sistema.entity";

@Entity("TBL_METODO")
export class MetodoEntity {

    @Column("uuid", { primary: true, generated: 'uuid' })
    id?: string;

    @Column("text", { unique: true, nullable: false })
    name: string;

    @Column("text", {})
    description?: string;

    @Column("boolean", { name: "isActive", default: false })
    isActive?: boolean;

    @ManyToMany(type => SistemaEntity, e => e._metodoList)
    _sistemaList?: SistemaEntity[];

    // @OneToMany(type => SistemaMetodoEntity, e => e._metodo, { })
    // _sistemaMetodoList?: SistemaMetodoEntity;
}