import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany } from "typeorm";

import { MetodoEntity } from "./metodo.entity";
import { SistemaMetodoEntity } from "./sistema-metodo.entity";

@Entity("TBL_SISTEMA")
export class SistemaEntity {
    @Column("uuid", { primary: true, generated: 'uuid' })
    id?: string;

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

    @ManyToMany(type => MetodoEntity, e => e._sistemaList, { cascade: ['insert'] })
    @JoinTable({ 
        name: 'REL_SISTEMA_X_METODO', 
        joinColumn: { name: 'sistemaId', referencedColumnName: 'id'}, 
        inverseJoinColumn: { name: 'metodoId', referencedColumnName: 'id' } 
    })
    _metodoList?: MetodoEntity[];

    // @OneToMany(type => SistemaMetodoEntity, e => e._sistema, {})
    // _sistemaMetodoList?: SistemaMetodoEntity;
}
