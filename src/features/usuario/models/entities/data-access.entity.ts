import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { IdEntityAbstractClass } from "@sd-root/libs/common/src/models/classes/entity-abstract.class";
import { ProfileEntity } from "./profile.entity";
import { UsuarioEntity } from "./usuario.entity";

@Entity({ name: 'TBL_DATA_ACCESS' })
export class DataAccessEntity extends IdEntityAbstractClass  {

    @Column("text")
    username: string;

    @Column("text")
    password?: string;

    @Column("integer", { name: 'passCountErrors', default: 0 })
    passCountErrors?: number;

    @Column("boolean", { name: 'isPasswordLocked', default: false })
    isPasswordLocked?: boolean;

    @Column("boolean", { name: 'isPasswordRequireChange', default: true })
    isPasswordRequireChange?: boolean;

    @OneToOne(type => ProfileEntity, e => e._dataAccess, { eager: true })
    @JoinColumn()
    _profileList?: ProfileEntity[];

    @OneToOne(type => UsuarioEntity, e => e._dataAccess)
    _usuario?: UsuarioEntity;

    public static getEntityList(): EntityClassOrSchema[] {
        return [DataAccessEntity, ProfileEntity/*, ...UsuarioEntity.getEntityList()*/];
    }

}
