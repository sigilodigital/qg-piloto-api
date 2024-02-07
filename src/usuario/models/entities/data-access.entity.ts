import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { ProfileEntity } from "./profile.entity";
import { UsuarioEntity } from "./usuario.entity";

@Entity({ name: 'TBL_DATA_ACCESS' })
export class DataAccessEntity {

    @Column('uuid', { generated: 'uuid', primary: true })
    id?: string;

    @Column("text")
    username: string;

    @Column("text", { select: false })
    password: string;

    @Column("text", { name: 'passwordHash', select: false })
    passwordHash?: string;

    @Column("integer", { name: 'passCountErrors', default: 0 })
    passCountErrors?: number;

    @Column("boolean", { name: 'isPasswordLocked', default: false })
    isPasswordLocked?: boolean;

    @Column("boolean", { name: 'isPasswordRequireChange', default: true })
    isPasswordRequireChange?: boolean;

    @OneToOne(type => ProfileEntity, e => e._dataAccess)
    @JoinColumn()
    _profileList?: ProfileEntity[];

    @OneToOne(type => UsuarioEntity, e => e._dataAccess)
    _usuario?: UsuarioEntity;

}
