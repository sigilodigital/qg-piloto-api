import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity } from "typeorm";

@Entity("TBL_SEG_SISTEMA_WS", {schema: 'IUSR_PROTON'})
export class SegSistemaWsDto {
  @ApiProperty({
    name: 'codAtivo',
    type: Number,
    required: false
  })
  @Column("number", { name: "COD_ATIVO" })
  codAtivo: number;

  @ApiProperty({
    name: 'txtSenha',
    type: String,
    required: true
  })
  @Column("varchar2", { name: "TXT_SENHA", length: 30 })
  txtSenha: string;

  @ApiProperty({
    name: 'txtDescricao',
    type: String,
    required: false
  })
  @Column("varchar2", { name: "TXT_DESCRICAO", length: 500 })
  txtDescricao: string;

  @ApiProperty({
    name: 'txtLogin',
    type: String,
    required: false
  })
  @Column("varchar2", { name: "TXT_LOGIN", length: 50 })
  txtLogin: string;

  @ApiProperty({
    name: 'txtSegSistemaWs',
    type: String,
    required: false
  })
  @Column("varchar2", { name: "TXT_SEG_SISTEMA_WS", length: 100 })
  txtSegSistemaWs: string;

  @ApiProperty({
    name: 'codSegSistemaWs',
    type: String,
    required: false
  })
  @Column("number", { 
    primary: true, 
    name: "COD_SEG_SISTEMA_WS" 
  }) 
  codSegSistemaWs: number;

}
