import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";

import { EntityAbstractClass } from "@sd-root/libs/common/src/models/classes/entity-abstract.class";
import { ContatoEntity } from "@sd-root/libs/common/src/models/entities/contato/contato.entity";
import { UsuarioEntity } from "@sd-root/src/features/usuario/models/entities/usuario.entity";
import { AvaliadorDocumentacaoEntity } from "./avaliador-documentacao.entity";

@Index("PK_TBL_AVALIADOR", ["id"], { unique: true })
@Entity({ name: 'TBL_AVALIADOR' })
export class AvaliadorEntity extends EntityAbstractClass {

    @Column("varchar", { name: "nacionalidade", nullable: true })
    nacionalidade?: string | null;

    @Column("varchar", { name: "naturalidade", nullable: true })
    naturalidade?: string | null;

    @Column("text", { name: "nomeMae", nullable: true })
    nomeMae?: string | null;

    @Column("text", { name: "nomePai", nullable: true })
    nomePai?: string | null;

    @Column("text", { name: "instituicaoNome", nullable: true })
    instituicaoNome?: string | null;

    @OneToOne(type => ContatoEntity, e => e._usuario, { cascade: ['insert', 'update', 'remove'] })
    @JoinColumn()
    _instituicaoContato?: ContatoEntity;

    @OneToOne(type => AvaliadorDocumentacaoEntity, e => e._avaliador, { cascade: ['insert', 'update', 'remove'] })
    @JoinColumn()
    _documentacao?: AvaliadorDocumentacaoEntity;

    @OneToOne(type => UsuarioEntity)
    @JoinColumn({ referencedColumnName: 'id' })
    _usuario: UsuarioEntity;

}
