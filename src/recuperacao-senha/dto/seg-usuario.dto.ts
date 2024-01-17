import { Column, Entity } from "typeorm";

@Entity("TBL_SEG_USUARIO")
export class SegUsuario {

  @Column("varchar2", { name: "TXT_SENHA", length: 64 })
  txtSenha: string;

  @Column("number", { name: "COD_INTERESSADO" })
  codInteressado: number;

  @Column("number", { primary: true, name: "COD_USUARIO", scale: 0 })
  codUsuario: number;

}