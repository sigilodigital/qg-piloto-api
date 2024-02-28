import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";

import { EmailEntity } from "./email.entity";
import { EnderecoEntity } from "./endereco.entity";
import { TelefoneEntity } from "./telefone.entity";
import { AvaliadorEntity } from "./avaliador.entity";

@Entity({ name: 'TBL_CONTATO' })
export class ContatoEntity {

    @Column('uuid', { generated: 'uuid', primary: true })
    id?: string;

    @OneToMany(type => EmailEntity, e => e._contato, { eager: true, cascade: ['insert', 'update', 'remove'] })
    _emailList: EmailEntity[];

    @OneToMany(type => TelefoneEntity, e => e._contato, { eager: true, cascade: ['insert', 'update', 'remove'] })
    _telefoneList: TelefoneEntity[];

    @OneToMany(type => EnderecoEntity, e => e._contato, { eager: true, cascade: ['insert', 'update', 'remove'] })
    _enderecoList: EnderecoEntity[];

    @OneToOne(type => AvaliadorEntity, e => e._contato)
    // @JoinColumn()
    _avaliador?: AvaliadorEntity;

    public static getEntityList(): EntityClassOrSchema[] {
        return [ContatoEntity, EmailEntity, TelefoneEntity, EnderecoEntity];
    }
}
