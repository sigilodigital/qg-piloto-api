import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { ContatoEntity } from "./contato.entity";

@Entity({ name: 'USUARIO' })
export class UsuarioEntity {

    @Column('uuid', { generated: 'uuid', primary: true })
    id?: string;

    @Column("varchar", { name: "fullname", length: 255 })
    fullname: string;

    @Column("bigint", { name: "cpf", unique: true })
    cpf: number;

    @Column("varchar", { name: "password", length: 20, select: false })
    password: string;

    @Column("boolean", { name: "isActive", default: true })
    isActive: boolean;

    @OneToOne(type => ContatoEntity, c => c._usuario, { eager: true, cascade: ['insert', 'update', 'remove'] })
    @JoinColumn()
    _contato: ContatoEntity;

}
