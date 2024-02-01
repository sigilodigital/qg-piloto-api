import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { ContatoEntity } from "./contato.entity";
import { UsuarioEntity } from "./usuario.entity";
import { ProfileEntity } from "./profile.entity";

@Entity({ name: 'DATA_ACCESS' })
export class DataAccessEntity {

    @Column('uuid', { generated: 'uuid', primary: true })
    id?: string;

    @Column("text")
    username: string;

    @Column("text")
    password: string;

    @Column("text")
    passwordHash: string;

    @OneToOne(type => ProfileEntity, e => e._dataAccess, { lazy: true, cascade: ['insert', 'update', 'remove'] })
    @JoinColumn()
    _profileList: ProfileEntity[];

    @OneToOne(type => UsuarioEntity, e => e._dataAccess, { lazy: true, cascade: ['insert', 'update', 'remove'] })
    @JoinColumn()
    _usuario: UsuarioEntity;

}
