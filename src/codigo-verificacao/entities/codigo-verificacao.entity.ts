import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntitySchema } from 'typeorm';

@Entity('TBL_CODIGO_VERIFICACAO_PESSOA', {schema:'IUSR_PORTAL'})
export class CodigoVerificacaoEntity implements ICodigoVerificacao {
  // TODO: verificar como usar sequence no decorator
  // @PrimaryColumn({
  //   nullable: false,
  //   name: "COD_MENSAGEM",
  //   default:()=> "SELECT S_TBL_CODIGO_VERIFICACAO_PESSOA.NEXTVAL FROM DUAL"
  // })
  @PrimaryGeneratedColumn('increment',{
    name: 'COD_CODIGO_VERIFICACAO_PESSOA',
  })
  codCodigoVerificacaoPessoa: number;

  @Column('varchar', {
    name: 'TXT_INTERESSADO',
    length: 255,
    nullable: false, 
  })
  txtInteressado: string;

  @Column('varchar', {
    name: 'TXT_CNPJ_CPF',
    length: 14,
    nullable: false,
  })
  txtCnpjCpf: string;

  @Column('varchar', {
    name: 'TXT_CODIGO_SEGURANCA',
    length: 50,
    nullable: false,
  })
  txtCodigoSeguranca: string;

  @Column('date', {
    name: 'DT_EXPIRACAO',
    nullable: false,
  })
  dtExpiracao: Date;
}

interface ICodigoVerificacao {
    codCodigoVerificacaoPessoa: number;
    txtInteressado: string;
    txtCnpjCpf: string;
    txtCodigoSeguranca: string;
    dtExpiracao: Date;
}