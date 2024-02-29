import { ContatoEntity } from "@sd-root/libs/common/src/models/entities/contato/contato.entity";
import { IdEntityAbstractClass } from "@sd-root/libs/common/src/models/entities/id-entity-class.entity";
import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";

@Index("PK_TBL_DOCUMENTACAO", ["id"], { unique: true })
@Entity({ name: 'TBL_DOCUMENTACAO' })
export class DocumentacaoEntity extends IdEntityAbstractClass  {

    @Column("text", { name: "instituicaoNome", nullable: true })
    instituicaoNome?: string | null;

    @OneToOne(type => ContatoEntity, e => e._usuario, { cascade: ['insert', 'update', 'remove'] })
    @JoinColumn()
    _instituicaoContato?: ContatoEntity;

    @Column("text", { name: "identDtExpedicao", nullable: true })
    identDtExpedicao?: string | null;

    @Column("text", { name: "identOrgaoExpedidor", nullable: true })
    identOrgaoExpedidor?: string | null;

    @Column("text", { name: "nit_pis_pasep", nullable: true })
    nit_pis_pasep?: string | null;

    @Column("text", { name: "bancoNome", nullable: true })
    bancoNome?: string | null;

    @Column("text", { name: "bancoAgencia", nullable: true })
    bancoAgencia: string | null;

    @Column("text", { name: "bancoConta", nullable: true })
    bancoConta: string | null;

    @Column("boolean", { name: "isActive", default: true })
    isActive: boolean;

}
