import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";

import { ProfileEntity } from "./profile.entity";
import { AvaliadorEntity } from "./avaliador.entity";

@Entity({ name: 'TBL_DATA_ACCESS' })
export class DataAccessEntity {

    @Column('uuid', { generated: 'uuid', primary: true })
    id?: string;

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

    @OneToOne(type => AvaliadorEntity, e => e._dataAccess)
    _avaliador?: AvaliadorEntity;

    public static getEntityList(): EntityClassOrSchema[] {
        return [DataAccessEntity, ProfileEntity, ...AvaliadorEntity.getEntityList()];
    }

}
