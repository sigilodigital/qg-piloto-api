import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, Index } from "typeorm";

@Index("PK_TBL_SISTEMA_MENSAGEM_FILA", ["codMensagem"], { unique: true })
@Entity("TBL_SISTEMA_MENSAGEM_FILA", {schema: 'IUSR_PROTON'})
export class SistemaMensagemFilaDto {
  @Column("varchar2", { name: "TXT_PARA", nullable: true, length: 255 })
  txtPara: string | null;

  @Column("clob", { name: "TXT_MENSAGEM", nullable: true })
  txtMensagem: string | null;

  @Column("varchar2", { name: "TXT_DE", nullable: true, length: 255 })
  txtDe: string | null;

  @Column("varchar2", { name: "TXT_COPIA_OCULTA", nullable: true, length: 255 })
  txtCopiaOculta: string | null;

  @Column("varchar2", { name: "TXT_COPIA", nullable: true, length: 255 })
  txtCopia: string | null;

  @Column("varchar2", { name: "TXT_ASSUNTO", nullable: true, length: 255 })
  txtAssunto: string | null;

  @Column("number", {
    name: "COD_MENSAGEM_TIPO",
    scale: 0,
    default: () => "(1)",
  })
  codMensagemTipo: number;

  @Column("number", {
    primary: true,
    name: "COD_MENSAGEM",
    precision: 6,
    scale: 0,
  })
  codMensagem: number;

  @Column("number", { name: "COD_ENVIADO", scale: 0, default: () => "(0)" })
  codEnviado: number;

  @ApiProperty({
    name: 'txtConfig',
    type: String,
    description: 'Campo obrigatório para verificar modelo de email.'
  })
  txtConfig: string;
}
