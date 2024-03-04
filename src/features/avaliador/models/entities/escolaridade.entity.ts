import { Column, Entity, Index } from "typeorm";

import { EntityAbstractClass } from "@sd-root/libs/common/src/models/classes/entity-abstract.class";
import { NivelEscolaridadeEnum } from "../enums/nivel-escolaridade";
import { TipoGraduacaoEnum } from "../enums/tipo-graduacao";

@Index("PK_TBL_ESCOLARIDADE", ["id"], { unique: true })
@Entity({ name: 'TBL_ESCOLARIDADE' })
export class EscolaridadeEntity extends EntityAbstractClass  {

    @Column("text", { name: "tipoEscolaridade" })
    tipoEscolaridade: NivelEscolaridadeEnum; // GRADUACAO | ESPECIALIZACAO | MESTRADO | DOUTORADO | POS_DOUTORADO

    @Column("text", { name: "tipoGraduacao" })
    tipoGraduacao: TipoGraduacaoEnum; // BACHARELADO | LICENCIATURA | TECNOLOGICO

    @Column("date", { name: "dtConclusao" })
    dtConclusao: Date;

}
