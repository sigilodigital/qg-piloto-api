import { Column, Entity, ManyToOne } from "typeorm";

import { IdEntityAbstractClass } from "@sd-root/libs/common/src/models/entities/id-entity-class.entity";
import { DataAccessEntity } from "./data-access.entity";

@Entity({ name: 'TBL_PROFILE' })
export class ProfileEntity extends IdEntityAbstractClass  {

    @Column("text")
    name: string;

    // TODO: mudar relacionamento para ManyToMany
    @ManyToOne(type => DataAccessEntity, e => e._profileList)
    _dataAccess?: DataAccessEntity;

}
