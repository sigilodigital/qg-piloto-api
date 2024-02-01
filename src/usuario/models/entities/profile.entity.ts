import { Column, Entity, JoinColumn, OneToOne, ManyToOne } from "typeorm";
import { ContatoEntity } from "./contato.entity";
import { UsuarioEntity } from "./usuario.entity";
import { DataAccessEntity } from "./data-access.entity";

@Entity({ name: 'PROFILE' })
export class ProfileEntity {

    @Column('uuid', { generated: 'uuid', primary: true })
    id?: string;

    @Column("text")
    username: string;

    @Column("text")
    password: string;

    @Column("text")
    passwordHash: string;

    @OneToOne(type => ProfileEntity, e => e._dataAccess, { cascade: ['insert', 'update', 'remove'] })
    @JoinColumn()
    _profileList: ProfileEntity;

    @ManyToOne(type => DataAccessEntity, e => e._profileList, { cascade: ['insert', 'update', 'remove'] })
    @JoinColumn({name: 'DataAccessId'})
    _dataAccess: DataAccessEntity;

}
