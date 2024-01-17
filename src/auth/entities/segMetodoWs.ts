import { Column, Entity, Index } from "typeorm";

@Index("PK_TBL_SEG_METODO_WS", ["codSegMetodoWs"], { unique: true })
@Entity("TBL_SEG_METODO_WS", {schema: 'IUSR_PROTON'})
export class SegMetodoWs {
  @Column("number", { name: "COD_ATIVO" })
  codAtivo: number;

  @Column("varchar2", { name: "TXT_DESCRICAO", length: 255 })
  txtDescricao: string;

  @Column("varchar2", { name: "TXT_METODO", length: 50 })
  txtMetodo: string;

  @Column("number", { primary: true, name: "COD_SEG_METODO_WS" })
  codSegMetodoWs: number;
}
