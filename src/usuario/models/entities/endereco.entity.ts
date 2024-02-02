import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { ContatoEntity } from "./contato.entity";

@Entity({ name: 'CONTATO_ENDERECO' })
export class EnderecoEntity {

    @Column('uuid', { generated: 'uuid', primary: true })
    id?: string;

    @Column()
    place: string;

    @Column()
    number: string;

    @Column({ nullable: true })
    description: string | null;

    @ManyToOne(type => ContatoEntity, e => e._enderecoList)
    @JoinColumn()
    _contato?: ContatoEntity;

}
