import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { ProfileEntity } from "./profile.entity";
import { UsuarioEntity } from "./usuario.entity";

@Entity({ name: 'DATA_ACCESS' })
export class DataAccessEntity {

    @Column('uuid', { generated: 'uuid', primary: true })
    id?: string;

    @Column("text")
    username: string;

    @Column("text", { select: false })
    password: string;

    @Column("text", { select: false })
    passwordHash: string;

    @OneToOne(type => ProfileEntity, e => e._dataAccess)
    @JoinColumn()
    _profileList: ProfileEntity[];

    @OneToOne(type => UsuarioEntity, e => e._dataAccess)
    @JoinColumn()
    _usuario: UsuarioEntity;

}
