import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";

import { IdEntityAbstractClass } from "@sd-root/libs/common/src/models/entities/id-entity-class.entity";
import { AvaliadorEntity } from "./avaliador.entity";

@Index("PK_TBL_AVALIADOR_DOCUMENTACAO", ["id"], { unique: true })
@Entity({ name: 'TBL_AVALIADOR_DOCUMENTACAO' })
export class AvaliadorDocumentacaoEntity extends IdEntityAbstractClass  {

    @Column("text", { name: "urlCurriculum", nullable: true })
    urlCurriculum?: string | null;

    @Column("text", { name: "identNumero" })
    identNumero: string;

    @Column("text", { name: "identDtExpedicao" })
    identDtExpedicao: string;

    @Column("text", { name: "identOrgaoExpedidor" })
    identOrgaoExpedidor: string;

    @Column("text", { name: "nit_pis_pasep" })
    nit_pis_pasep: string;

    @Column("text", { name: "bancoNome" })
    bancoNome: string;

    @Column("text", { name: "bancoAgencia" })
    bancoAgencia: string;

    @Column("text", { name: "bancoContaNumero" })
    bancoContaNumero: string;

    @Column("text", { name: "bancoContaDigito" })
    bancoContaDigito: string;

    @Column("boolean", { name: "seExpCoordCursoES" })
    seExpCoordCursoES: boolean;

    @Column("boolean", { name: "seExpAvalES" })
    seExpAvalES: boolean;

    @Column("boolean", { name: "seExpDocenciaES" })
    seExpDocenciaES: boolean;

    @Column("boolean", { name: "seExpEADTutDoc" })
    seExpEADTutDoc: boolean;

    @Column("boolean", { name: "isActive", default: true })
    isActive: boolean;

    @OneToOne(type => AvaliadorEntity, e => e._documentacao)
    @JoinColumn()
    _avaliador?: AvaliadorEntity;

}
