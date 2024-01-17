import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
} from "typeorm";
import { AppDataSource } from "../../database";

@Entity("TBL_SEG_CONFIGURACAO", {schema: 'IUSR_PROTON'})
export class SegConfiguracao {


  async getSequence() {
    const sequence = await AppDataSource.manager.query(`SELECT IUSR_PROTON.S_CONFIGURACAO.NEXTVAL FROM DUAL`);
    return  +sequence[0].NEXTVAL;
  }

  @ApiProperty({
    name: 'txtValorPadrao',
    type: String
  })
  @Column("varchar2", {
    name: "TXT_VALOR_PADRAO",
    nullable: true,
    length: 1000,
  })
  txtValorPadrao: string | null;

  @ApiProperty({
    name: 'txtDescricao',
    type: String
  })
  @Column("varchar2", { name: "TXT_DESCRICAO", nullable: true, length: 255 })
  txtDescricao: string | null;

  @ApiProperty({
    name: 'txtConfiguracao',
    type: String
  })
  @Column("varchar2", { name: "TXT_CONFIGURACAO", length: 255 })
  txtConfiguracao: string;

  @ApiProperty({
    name: 'codConfiguracaoTipo',
    type: Number
  })
  @Column("number", {
    name: "COD_CONFIGURACAO_TIPO",
    scale: 0,
    default: () => "(1)",
  })
  codConfiguracaoTipo: number;

  @ApiProperty({
    name: 'codConfiguracao',
    type: Number
  })
  @Column("number", { primary: true, name: "COD_CONFIGURACAO", scale: 0 })
  codConfiguracao: number;

  @ApiProperty({
    name: 'codAtivo',
    type: Number
  })
  @Column("number", { name: "COD_ATIVO", scale: 0, default: () => "1" })
  codAtivo: number;

}
