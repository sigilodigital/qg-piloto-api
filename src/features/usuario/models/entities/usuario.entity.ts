import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { Index } from "typeorm";
import { ContatoEntity } from "./contato.entity";
import { DataAccessEntity } from "./data-access.entity";
import { LoginInfoEntity } from "./login-info.entity";

@Index("PK_TBL_USUARIO", ["id"], { unique: true })
@Entity({ name: 'TBL_USUARIO' })
export class UsuarioEntity {

    @Column('uuid', { generated: 'uuid', primary: true })
    id?: string;

    @Column("bigint", { name: "cpf", unique: true })
    cpf: number;

    @Column("varchar", { name: "fullname" })
    fullname: string;

    @Column("varchar", { name: "socialname", nullable: true })
    socialname?: string | null;

    @Column("varchar", { name: "gender", nullable: true })
    gender?: string | null;

    @Column("varchar", { name: "maritalStatus", nullable: true })
    maritalStatus?: string | null;

    @Column("varchar", { name: "birthDate", nullable: true })
    birthDate?: Date | null;

    @Column("boolean", { name: "isActive", default: true })
    isActive: boolean;

    @OneToOne(type => ContatoEntity, e => e._usuario, { cascade: ['insert', 'update', 'remove'] })
    @JoinColumn()
    _contato?: ContatoEntity;

    @OneToOne(type => LoginInfoEntity, e => e._usuario, { cascade: ['insert', 'update', 'remove'] })
    @JoinColumn()
    _loginInfo?: LoginInfoEntity;

    @OneToOne(type => DataAccessEntity, e => e._usuario, { cascade: ['insert', 'update', 'remove'] })
    @JoinColumn()
    _dataAccess?: DataAccessEntity;

    public static getEntityList(): EntityClassOrSchema[] {
        return [UsuarioEntity, LoginInfoEntity, ...DataAccessEntity.getEntityList(), ...ContatoEntity.getEntityList()];
    }
}
