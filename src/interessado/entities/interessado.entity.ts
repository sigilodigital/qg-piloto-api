import { ApiProperty } from "@nestjs/swagger";
import {
    Column,
    Entity,
    Index
} from "typeorm";

@Index("IX_TXT_INTERESSADO", ["txtInteressado"], {})
@Index("PK_TBL_PROTOCOLO_INTERESSADO_1", ["codInteressado"], { unique: true })
@Index("UQ_INTERESSADO_01", ["txtCnpjCpf"], { unique: true })
@Entity("TBL_INTERESSADO", { schema: 'IUSR_PROTON' })
export class InteressadoEntity {
    @ApiProperty({
        name: 'codInteressado',
        type: Number
    })
    @Column("number", { primary: true, name: "COD_INTERESSADO", scale: 0 })
    codInteressado: number;

    @ApiProperty({
        description: 'txtInteressado',
        type: String
    })
    @Column("varchar2", { name: "TXT_INTERESSADO", length: 255 })
    txtInteressado: string;

    @ApiProperty({
        name: 'txtCnpjCpf',
        type: String
    })
    @Column("varchar2", { name: 'TXT_CNPJ_CPF' })
    txtCnpjCpf: string;

    @ApiProperty({
        name: 'txtEmail',
        type: String
    })
    @Column("varchar2", { name: 'TXT_EMAIL' })
    txtEmail: string;

    @ApiProperty({
        name: 'codPessoaTipo',
        type: Number
    })
    @Column("number", { name: 'COD_PESSOA_TIPO' })
    codPessoaTipo: number;

    @ApiProperty({
        name: 'txtNomeFantasia',
        type: String
    })
    @Column("varchar2", { name: 'TXT_NOME_FANTASIA' })
    txtNomeFantasia: string;

    @ApiProperty({
        name: 'txtRazaoSocial',
        type: String
    })
    txtRazaoSocial: string;

    @Column("number", { name: 'COD_ATIVO' })
    codAtivo: number;
}
