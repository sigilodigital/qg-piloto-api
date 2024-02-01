import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { EmailEntity } from "./email.entity";
import { ContatoEntity } from "./contato.entity";

@Entity({ name: 'USUARIO' })
export class UsuarioEntity {

    @PrimaryGeneratedColumn('increment')
    usuarioId: number;

    @Column('uuid', { generated: 'uuid' })
    id: string;

    @Column("varchar", { name: "fullname", nullable: false, length: 255 })
    fullname: string;

    @Column("bigint", { name: "cpf", nullable: false, unique: true })
    cpf: number;

    @Column("varchar", { name: "password", length: 20, select: false })
    password: string;

    @Column("boolean", { name: "isActive", default: true })
    isActive: boolean;

    @OneToOne(type => ContatoEntity, _usuario => UsuarioEntity, { eager: true, cascade: ['insert', 'update'] })
    @JoinColumn()
    _contato: ContatoEntity;

}
