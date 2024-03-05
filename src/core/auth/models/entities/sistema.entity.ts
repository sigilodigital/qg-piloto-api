import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany } from "typeorm";

import { MetodoEntity } from "./metodo.entity";
import { SistemaMetodoEntity } from "./sistema-metodo.entity";
import { IdEntityAbstractClass } from "@sd-root/libs/common/src/models/classes/entity-abstract.class";

@Index("PK_TBL_SISTEMA", ["id"], { unique: true })
@Entity("TBL_SISTEMA")
export class SistemaEntity extends IdEntityAbstractClass  {

    @Column("text", { name: "name", unique: true })
    name: string;

    @Column("text", { name: "username", unique: true })
    username: string;

    @Column("text", { name: "password" })
    password: string;

    @Column("text", { name: "description" })
    description?: string;

    @Column("boolean", { name: "isActive", default: false })
    isActive?: boolean;

    @ManyToMany(type => MetodoEntity, e => e._sistemaList, { eager: true  })
    @JoinTable({
        name: 'REL_SISTEMA_X_METODO', 
        joinColumn: { name: 'SistemaId', referencedColumnName: 'id'}, 
        inverseJoinColumn: { name: 'MetodoId', referencedColumnName: 'id' } 
    })
    _metodoList?: MetodoEntity[];

    // @OneToMany(type => SistemaMetodoEntity, e => e._sistema, {})
    // _sistemaMetodoList?: SistemaMetodoEntity;
}
