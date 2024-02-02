import { Column, Entity, JoinColumn, OneToOne, OneToMany } from "typeorm";
import { ContatoEntity } from "./contato.entity";
import { LoginInfoEntity } from "./login-info.entity";
import { DataAccessEntity } from "./data-access.entity";
import { MetadataEntity } from "@libs/common/models/entities/metadata.entity";

@Entity({ name: 'USUARIO' })
export class UsuarioEntity {

    @Column('uuid', { generated: 'uuid', primary: true })
    id?: string;

    @Column("varchar", { name: "fullname", length: 255 })
    fullname: string;

    @Column("bigint", { name: "cpf", unique: true })
    cpf: number;

    @Column("boolean", { name: "isActive", default: true })
    isActive: boolean;

    @OneToOne(type => ContatoEntity, e => e._usuario, { cascade: ['insert', 'update', 'remove'] })
    @JoinColumn()
    _contato: ContatoEntity;

    @OneToOne(type => LoginInfoEntity, e => e._usuario, { cascade: ['insert', 'update', 'remove'] })
    @JoinColumn({name: 'LoginInfoId'})
    _loginInfo?: LoginInfoEntity;

    @OneToOne(type => DataAccessEntity, e => e._usuario, { lazy: true, cascade: ['insert', 'update', 'remove'] })
    @JoinColumn({name: 'DataAccessId'})
    _dataAccess?: DataAccessEntity;

}
