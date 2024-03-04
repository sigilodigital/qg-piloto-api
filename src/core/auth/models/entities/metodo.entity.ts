import { Column, Entity, ManyToMany } from "typeorm";

import { EntityAbstractClass } from "@sd-root/libs/common/src/models/classes/entity-abstract.class";
import { SistemaEntity } from "./sistema.entity";

@Entity("TBL_METODO")
export class MetodoEntity extends EntityAbstractClass {

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