import { Column, Entity, OneToOne } from "typeorm";

import { IdEntityAbstractClass } from "@sd-root/libs/common/src/models/entities/id-entity-class.entity";
import { UsuarioEntity } from "./usuario.entity";

@Entity({ name: 'TBL_LOGIN_INFO' })
export class LoginInfoEntity extends IdEntityAbstractClass  {

    @Column("integer", { name: "accessCount" })
    accessCount: number;

    @Column("timestamp", { name: "lastDate" })
    lastDate: Date;

    @Column("timestamp", { name: "actualDate" })
    actualDate: Date;

    @Column("text", { name: "ipClient" })
    ipClient: string;

    @Column("text")
    token: string;

    @OneToOne(type => UsuarioEntity, e => e._loginInfo)
    _usuario: UsuarioEntity;

}
