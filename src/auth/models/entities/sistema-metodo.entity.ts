import { Column, Entity, Index, ManyToMany } from "typeorm";
import { SistemaEntity } from "./sistema.entity";

@Index("PK_TBL_SISTEMA_METODO", ["sistemaId", "metodoId"], { unique: true })
@Entity("TBL_SISTEMA_METODO")
export class SistemaMetodoEntity {

    @Column("uuid", { primary: true })
    sistemaId: number;

    @Column("uuid", { primary: true })
    metodoId: number;

}