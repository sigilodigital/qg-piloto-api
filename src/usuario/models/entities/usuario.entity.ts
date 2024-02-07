import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { ContatoEntity } from "./contato.entity";
import { DataAccessEntity } from "./data-access.entity";
import { LoginInfoEntity } from "./login-info.entity";

@Entity({ name: 'TBL_USUARIO' })
export class UsuarioEntity {

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

    @OneToOne(type => ContatoEntity, e => e._usuario, { cascade: ['insert', 'update', 'remove'] })
    @JoinColumn()
    _contato?: ContatoEntity;

    @OneToOne(type => LoginInfoEntity, e => e._usuario, { cascade: ['insert', 'update', 'remove'] })
    @JoinColumn({name: 'LoginInfoId'})
    _loginInfo?: LoginInfoEntity;

    @OneToOne(type => DataAccessEntity, e => e._usuario, { cascade: ['insert', 'update', 'remove'] })
    @JoinColumn()
    _dataAccess?: DataAccessEntity;

}
