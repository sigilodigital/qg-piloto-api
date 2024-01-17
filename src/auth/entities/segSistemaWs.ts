import { Column, Entity, Index, JoinTable, ManyToMany } from "typeorm";
import { SegMetodoWs } from "./segMetodoWs";

@Index("PK_TBL_SEG_SISTEMA_WS", ["codSegSistemaWs"], { unique: true })
@Entity("TBL_SEG_SISTEMA_WS", {schema: 'IUSR_PROTON'})
export class SegSistemaWs {
  @Column("number", { name: "COD_ATIVO" })
  codAtivo: number;

  @Column("varchar2", { name: "TXT_SENHA", length: 30 })
  txtSenha: string;

  @Column("varchar2", { name: "TXT_DESCRICAO", length: 500 })
  txtDescricao: string;

  @Column("varchar2", { name: "TXT_LOGIN", length: 50 })
  txtLogin: string;

  @Column("varchar2", { name: "TXT_SEG_SISTEMA_WS", length: 100 })
  txtSegSistemaWs: string;

  @Column("number", { primary: true, name: "COD_SEG_SISTEMA_WS" })
  codSegSistemaWs: number;

}
