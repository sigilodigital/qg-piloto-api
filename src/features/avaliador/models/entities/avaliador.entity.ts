import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { Index } from "typeorm";
import { ContatoEntity } from "./contato.entity";
import { DataAccessEntity } from "./data-access.entity";
import { LoginInfoEntity } from "./login-info.entity";

@Index("PK_TBL_SISTEMA", ["id"], { unique: true })
@Entity({ name: 'TBL_AVALIADOR' })
export class AvaliadorEntity {

    @Column('uuid', { generated: 'uuid', primary: true })
    id?: string;

    @Column("varchar", { name: "fullname", length: 255 })
    fullname: string;

    @Column("varchar", { name: "socialname", length: 255, nullable: true })
    socialname?: string | null;

    @Column("bigint", { name: "cpf", unique: true })
    cpf: number;

    @Column("boolean", { name: "isActive", default: true })
    isActive: boolean;

    @OneToOne(type => ContatoEntity, e => e._avaliador, { cascade: ['insert', 'update', 'remove'] })
    @JoinColumn()
    _contato?: ContatoEntity;

    @OneToOne(type => LoginInfoEntity, e => e._avaliador, { cascade: ['insert', 'update', 'remove'] })
    @JoinColumn()
    _loginInfo?: LoginInfoEntity;

    @OneToOne(type => DataAccessEntity, e => e._avaliador, { cascade: ['insert', 'update', 'remove'] })
    @JoinColumn()
    _dataAccess?: DataAccessEntity;

    public static getEntityList(): EntityClassOrSchema[] {
        return [AvaliadorEntity, LoginInfoEntity, ...DataAccessEntity.getEntityList(), ...ContatoEntity.getEntityList()];
    }
}
