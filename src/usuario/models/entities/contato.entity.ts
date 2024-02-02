import { Column, Entity, OneToOne, OneToMany, JoinColumn } from "typeorm";
import { EmailEntity } from "./email.entity";
import { UsuarioEntity } from "./usuario.entity";
import { EnderecoEntity } from "./endereco.entity";
import { TelefoneEntity } from "./telefone.entity";

@Entity({ name: 'CONTATO' })
export class ContatoEntity {

    @Column('uuid', { generated: 'uuid', primary: true })
    id?: string;

    @OneToMany(type => EmailEntity, e => e._contato, { eager: true, cascade: ['insert', 'update', 'remove'] })
    _emailList: EmailEntity[];

    @OneToMany(type => TelefoneEntity, e => e._contato, { eager: true, cascade: ['insert', 'update', 'remove'] })
    _telefoneList: TelefoneEntity[];

    @OneToMany(type => EnderecoEntity, e => e._contato, { eager: true, cascade: ['insert', 'update', 'remove'] })
    _enderecoList: EnderecoEntity[];

    @OneToOne(type => UsuarioEntity, e => e._contato)
    // @JoinColumn()
    _usuario?: UsuarioEntity;
}
