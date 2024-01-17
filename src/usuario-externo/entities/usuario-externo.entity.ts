import { ApiProperty } from "@nestjs/swagger";
import { Validate } from "class-validator";
import { ValidaCampoPorSchema } from 'src/shared/validation/classes/validaCampoPorSchema';
import {
    Column,
    Entity
} from "typeorm";


@Entity({
    name: 'TBL_SEG_USUARIO_EXTERNO',
    schema: 'IUSR_PROTON'
})
export class UsuarioExterno {
    constructor(
        entrada?: UsuarioExterno
    ) {

        if (entrada) {
            Object.keys(entrada).forEach((property) => {
                this[property] = entrada[property];
            });
        }
    }
    @ApiProperty({
        name: 'txtSenha',
        type: String,
        required: true
    })
    @Validate(ValidaCampoPorSchema)
    @Column("varchar2", { name: "TXT_SENHA", nullable: true, length: 300 })
    txtSenha: string | null;

    @ApiProperty({
        name: 'txtResposta',
        type: String
    })
    @Validate(ValidaCampoPorSchema)
    @Column("varchar2", { name: "TXT_RESPOSTA", nullable: true, length: 255 })
    txtResposta: string | null;

    @ApiProperty({
        name: 'txtRazaoSocial',
        type: String
    })
    @Validate(ValidaCampoPorSchema)
    @Column("varchar2", { name: "TXT_RAZAO_SOCIAL", nullable: true, length: 255 })
    txtRazaoSocial: string | null;

    @ApiProperty({
        name: 'txtNome',
        type: String,
        nullable: true,
        maxLength: 255
    })
    @Column("varchar2", { name: "TXT_NOME", nullable: true, length: 255 })
    txtNome: string | null;

    @ApiProperty({
        name: 'txtEmail',
        type: String,
        nullable: false,
        maxLength: 255,
        required: true
    })
    @Validate(ValidaCampoPorSchema)
    @Column("varchar2", { name: "TXT_EMAIL", length: 255 })
    txtEmail: string;

    @ApiProperty({
        name: 'txtContador',
        type: String,
        nullable: true,
        maxLength: 255,
        required: false
    })
    @Validate(ValidaCampoPorSchema)
    @Column("varchar2", { name: "TXT_CONTADOR", nullable: true, length: 255 })
    txtContador: string | null;

    @ApiProperty({
        name: 'codUsuarioExterno',
        type: Number,
        nullable: true,
        required: false
    })
    @Validate(ValidaCampoPorSchema)
    @Column("number", { primary: true, name: "COD_USUARIO_EXTERNO", scale: 0 })
    codUsuarioExterno: number;

    @ApiProperty({
        name: 'codTipoLembranca',
        type: Number,
        nullable: true,
        required: false
    })
    @Validate(ValidaCampoPorSchema)
    @Column("number", { name: "COD_TIPO_LEMBRANCA", scale: 0 })
    codTipoLembranca: number;

    @ApiProperty({
        name: 'codTermo',
        type: Number,
        nullable: true,
        required: false
    })
    @Column("number", { name: "COD_TERMO", scale: 0 })
    codTermo: number;

    @ApiProperty({
        name: 'codTentativaPergunta',
        type: Number,
        nullable: true,
        required: false,
        default: 0
    })
    @Validate(ValidaCampoPorSchema)
    @Column("number", {
        name: "COD_TENTATIVA_PERGUNTA",
        scale: 0,
        default: () => "0",
    })
    codTentativaPergunta: number;

    @ApiProperty({
        name: 'codSenhaIncorreta',
        type: Number,
        nullable: true,
        required: false,
        default: 0
    })
    @Validate(ValidaCampoPorSchema)
    @Column("number", {
        name: "COD_SENHA_INCORRETA",
        scale: 0,
        default: () => "0",
    })
    codSenhaIncorreta: number;

    @ApiProperty({
        name: 'codSenhaIncorreta',
        type: Number,
        nullable: true,
        required: false
    })
    @Validate(ValidaCampoPorSchema)
    @Column("number", { name: "COD_SENHA_BLOQUEADA", scale: 0 })
    codSenhaBloqueada: number;

    @ApiProperty({
        name: 'codSenhaAlterada',
        type: Number,
        nullable: true,
        required: false,
        default: 1
    })
    @Validate(ValidaCampoPorSchema)
    @Column("number", {
        name: "COD_SENHA_ALTERADA",
        scale: 0,
        default: () => "1",
    })
    codSenhaAlterada: number;

    @ApiProperty({
        name: 'codPerSctBloqueada',
        type: Number,
        nullable: true,
        required: false,
        default: 0
    })
    @Validate(ValidaCampoPorSchema)
    @Column("number", {
        name: "COD_PER_SCT_BLOQUEADA",
        nullable: true,
        scale: 0,
        default: () => "0",
    })
    codPerSctBloqueada: number | null;

    @ApiProperty({
        name: 'codNewsletter',
        type: Number,
        nullable: true,
        required: false,
        default: 0
    })
    @Validate(ValidaCampoPorSchema)
    @Column("number", { name: "COD_NEWSLETTER", scale: 0, default: () => "0" })
    codNewsletter: number;

    @ApiProperty({
        name: 'codCertificado',
        type: Number,
        nullable: true,
        required: false,
        default: 0
    })
    @Validate(ValidaCampoPorSchema)
    @Column("number", { name: "COD_CERTIFICADO", scale: 0, default: () => "0" })
    codCertificado: number;

    @ApiProperty({
        name: 'codAtivo',
        type: Number,
        nullable: true,
        required: false,
        default: 1
    })
    @Validate(ValidaCampoPorSchema)
    @Column("number", { name: "COD_ATIVO", scale: 0, default: () => "1" })
    codAtivo: number;

    @ApiProperty({
        name: 'codInteressado',
        type: Number,
        nullable: true,
        required: false,
        default: 1
    })
    @Validate(ValidaCampoPorSchema)
    @Column("number", { name: "COD_INTERESSADO" })
    codInteressado: number;

    @ApiProperty({
        name: 'codPerguntaSecreta',
        type: Number
    })
    @Validate(ValidaCampoPorSchema)
    @Column("number", { name: "COD_PERGUNTA_SECRETA" })
    codPerguntaSecreta: number;

}
