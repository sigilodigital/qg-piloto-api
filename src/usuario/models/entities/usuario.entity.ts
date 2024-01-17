import { Column, Entity } from "typeorm";


@Entity({ name: 'USUARIO' })
export class UsuarioEntity {
    @Column("varchar2", { name: "fullname", nullable: false, length: 255, })
    fullname: string;

    @Column("varchar2", { name: "fullname", nullable: false, length: 255, primary: true, unique: true })
    cpf: number;

    @Column("varchar2", { name: "email", length: 100 })
    email: string;

    @Column("varchar2", { name: "password", length: 20 })
    password: string;

    @Column("boolean", { name: "isActive", default: () => true })
    isActive: boolean;
}
