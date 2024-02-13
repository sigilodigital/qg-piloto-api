import { Column, Entity, ManyToOne } from "typeorm";
import { DataAccessEntity } from "./data-access.entity";

@Entity({ name: 'TBL_PROFILE' })
export class ProfileEntity {

    @Column('uuid', { generated: 'uuid', primary: true })
    id?: string;

    @Column("text")
    name: string;

    // TODO: mudar relacionamento para ManyToMany
    @ManyToOne(type => DataAccessEntity, e => e._profileList)
    _dataAccess?: DataAccessEntity;

}
