import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'USUARIO' })
export class UsuarioEntity {
    
    @PrimaryGeneratedColumn()
    usuarioId: number;
    
    @Column("varchar", { name: "id", primary: true, nullable: false, length: 24, })
    id: string;

    @Column("varchar", { name: "fullname", nullable: false, length: 255, })
    fullname: string;

    @Column("integer", { name: "cpf", nullable: false, unique: true })
    cpf: number;

    @Column("varchar", { name: "email", length: 100 })
    email: string;

    @Column("varchar", { name: "password", length: 20, select: false })
    password: string;

    @Column("boolean", { name: "isActive", default: () => true })
    isActive: boolean;
}
