import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { ContatoEntity } from "./contato.entity";

@Entity({ name: 'ENDERECO' })
export class EnderecoEntity {

    @Column('uuid', { generated: 'uuid', primary: true })
    id?: string;

    @Column()
    place: string;

    @Column()
    number: string;

    @Column({ nullable: true })
    description: string | null;

    @ManyToOne(type => ContatoEntity, c => c._enderecoList)
    @JoinColumn()
    _contato?: ContatoEntity;

}
