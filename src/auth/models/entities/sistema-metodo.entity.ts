import { Column, Entity, Index, ManyToOne } from "typeorm";

import { MetodoEntity } from "./metodo.entity";
import { SistemaEntity } from "./sistema.entity";
import { JoinColumn } from "typeorm";

@Entity("TBL_SISTEMA_METODO")
export class SistemaMetodoEntity {

    @Column("uuid", { primary: true, generated: 'uuid' })
    id: string;

    // @ManyToOne(type => SistemaEntity, e => e._sistemaMetodoList)
    // @JoinColumn()
    // _sistema: SistemaEntity;
    
    // @ManyToOne(type => MetodoEntity, e => e._sistemaMetodoList)
    // @JoinColumn()
    // _metodo: MetodoEntity;

}
// @Entity("REL_SISTEMA_METODO")
// export class SistemaMetodoEntity {

//     // @Column("uuid", { primary: true, generated: 'uuid' })
//     // id: string;

//     @Column("uuid", { primary: true })
//     sistemaId: string;

//     @Column("uuid", { primary: true })
//     metodoId: string;

//     @ManyToOne(type => SistemaEntity, e => e._sistemaMetodoList)
//     @JoinColumn([{ name: 'sistema_id', referencedColumnName: 'id' }])
//     _sistema: SistemaEntity[];
    
//     @ManyToOne(type => MetodoEntity, e => e._sistemaMetodoList)
//     @JoinColumn([{ name: 'metodo_id', referencedColumnName: 'id' }])
//     _metodo: MetodoEntity[];

// }