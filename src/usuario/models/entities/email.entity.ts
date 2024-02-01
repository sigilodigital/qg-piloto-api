import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { ContatoEntity } from "./contato.entity";

@Entity({ name: 'EMAIL' })
export class EmailEntity {

    @Column('uuid', { generated: 'uuid', primary: true })
    id?: string;

    @Column({ name: "address", })
    address: string;

    @Column({ name: "description" })
    description?: string;

    @ManyToOne(type => ContatoEntity, _emailList => EmailEntity)
    @JoinColumn()
    _contato?: ContatoEntity;

}
