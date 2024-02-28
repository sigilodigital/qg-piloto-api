import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { ContatoEntity } from "./contato.entity";
import { AvaliadorEntity } from "./avaliador.entity";

@Entity({ name: 'TBL_LOGIN_INFO' })
export class LoginInfoEntity {

    @Column('uuid', { generated: 'uuid', primary: true })
    id?: string;

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

    @OneToOne(type => AvaliadorEntity, e => e._loginInfo)
    _avaliador: AvaliadorEntity;

}
