import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { ContatoEntity } from "./contato.entity";

@Entity({ name: 'CONTATO_EMAIL' })
export class EmailEntity {

    @Column('uuid', { generated: 'uuid', primary: true })
    id?: string;

    @Column({ name: "address", })
    address: string;

    @Column({ name: "description", nullable: true })
    description?: string;

    @ManyToOne(type => ContatoEntity, c => c._emailList)
    @JoinColumn()
    _contato?: ContatoEntity;

}
