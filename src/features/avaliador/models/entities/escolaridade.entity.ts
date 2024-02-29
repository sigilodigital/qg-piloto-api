import { Column, Entity, Index } from "typeorm";
import { TipoGraduacaoEnum } from "../enums/tipo-graduacao";
import { NivelEscolaridadeEnum } from "../enums/nivel-escolaridade";

@Index("PK_TBL_ESCOLARIDADE", ["id"], { unique: true })
@Entity({ name: 'TBL_ESCOLARIDADE' })
export class EscolaridadeEntity extends EntityClass  {

    @Column("text", { name: "tipoEscolaridade" })
    tipoEscolaridade: NivelEscolaridadeEnum; // GRADUACAO | ESPECIALIZACAO | MESTRADO | DOUTORADO | POS_DOUTORADO

    @Column("text", { name: "tipoGraduacao" })
    tipoGraduacao: TipoGraduacaoEnum; // BACHARELADO | LICENCIATURA | TECNOLOGICO

    @Column("date", { name: "dtConclusao" })
    dtConclusao: Date;

    @Column("boolean", { name: "isActive", default: true })
    isActive: boolean;

}
