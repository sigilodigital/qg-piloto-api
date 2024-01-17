import { Column, Entity, Index } from "typeorm";

@Index("PK_TBL_SISTEMA_MENSAGEM_1", ["codMensagem"], { unique: true })
@Entity("TBL_SISTEMA_MENSAGEM")
export class SistemaMensagem {
  @Column("varchar2", { name: "TXT_TITULO", nullable: true, length: 255 })
  txtTitulo: string | null;

  @Column("varchar2", {
    name: "TXT_REMETENTE_EMAIL",
    nullable: true,
    length: 255,
  })
  txtRemetenteEmail: string | null;

  @Column("varchar2", { name: "TXT_REMETENTE", nullable: true, length: 255 })
  txtRemetente: string | null;

  @Column("varchar2", {
    name: "TXT_MENSAGEM_TIPO",
    nullable: true,
    length: 100,
  })
  txtMensagemTipo: string | null;

  @Column("clob", { name: "TXT_MENSAGEM", nullable: true })
  txtMensagem: string | null;

  @Column("number", { name: "COD_MENSAGEM", scale: 0, primary: true })
  codMensagem: number;

  @Column("number", { name: "COD_ATIVO", scale: 0, default: () => "(1)" })
  codAtivo: number;
}
