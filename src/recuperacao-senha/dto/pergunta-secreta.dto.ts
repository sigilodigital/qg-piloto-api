import { Column, Entity, Index } from "typeorm";


@Index("TBL_PERGUNTA_SECRETA_PK", ["codPerguntaSecreta"], { unique: true })
@Entity("TBL_PERGUNTA_SECRETA", {schema: 'IUSR_PROTON'})
export class PerguntaSecretaDto {
  @Column("varchar2", { name: "TXT_PERGUNTA", length: 255 })
  txtPergunta: string;

  @Column("number", { primary: true, name: "COD_PERGUNTA_SECRETA", scale: 0 })
  codPerguntaSecreta: number;

  @Column("number", { name: "COD_ATIVO", scale: 0 })
  codAtivo: number;

}
