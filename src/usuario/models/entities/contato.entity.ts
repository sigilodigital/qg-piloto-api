import { Column, Entity, OneToOne, OneToMany, JoinColumn } from "typeorm";
import { EmailEntity } from "./email.entity";
import { UsuarioEntity } from "./usuario.entity";

@Entity({ name: 'CONTATO' })
export class ContatoEntity {

    @Column('uuid', { generated: 'uuid', primary: true })
    id?: string;

    @OneToMany(type => EmailEntity, _contato => ContatoEntity, { cascade: ['insert', 'update'] })
    _emailList: EmailEntity[];

    @OneToOne(type => UsuarioEntity, _contato => ContatoEntity)
    @JoinColumn()
    _usuario?: UsuarioEntity;
}
