import { Column, Entity, Index, ManyToOne } from "typeorm";

import { MetodoEntity } from "./metodo.entity";
import { SistemaEntity } from "./sistema.entity";

@Index("PK_TBL_SISTEMA_METODO", ["id", "sistemaId", "metodoId"], { unique: true })
@Entity("TBL_SISTEMA_METODO")
export class SistemaMetodoEntity {

    @Column("uuid", { primary: true, generated: 'uuid' })
    id: string;

    @ManyToOne(type => SistemaEntity, e => e._sistemaMetodoList)
    _sistema: SistemaEntity;

    @ManyToOne(type => MetodoEntity, e => e._sistemaMetodoList)
    _metodo: MetodoEntity;

}