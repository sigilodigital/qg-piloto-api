import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { ContatoEntity } from "./contato.entity";

@Entity({ name: 'CONTATO_TELEFONE' })
export class TelefoneEntity {

    @Column('uuid', { generated: 'uuid', primary: true })
    id?: string;

    @Column()
    number: string;

    @Column({ nullable: true })
    description?: string;

    @ManyToOne(type => ContatoEntity, e => e._telefoneList)
    @JoinColumn()
    _contato?: ContatoEntity;

}
