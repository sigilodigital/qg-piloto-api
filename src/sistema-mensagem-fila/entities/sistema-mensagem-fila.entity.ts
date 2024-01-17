export class SistemaMensagemFila { }

import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from "typeorm";



@Entity("TBL_SISTEMA_MENSAGEM_FILA", { schema: 'IUSR_PROTON' })
export class SistemaMensagemFilaEmail {

    @ApiProperty({ name: 'codMensagem', description: '•	Código da mensagem' })
    @PrimaryColumn({
        nullable: false,
        name: "COD_MENSAGEM",
        default: () => "S_TBL_SISTEMA_MENSAGEM_FILA.NEXTVAL"
    })
    codMensagem: number;

    @ApiProperty({ name: 'txtPara', description: 'Nome do destinatário do e-mail.' })

    @Column("varchar2", { name: "TXT_PARA", nullable: true, length: 255 })
    txtPara: string | null;

    @ApiProperty({ name: 'txtMensagem', description: 'Texto da mensagem do e-mail. ' })
    @Column("clob", { name: "TXT_MENSAGEM", nullable: true })
    txtMensagem: string | null;

    @ApiProperty({ name: 'txtDe', description: 'Nome do remetente do e-mail' })
    @Column("varchar2", { name: "TXT_DE", nullable: true, length: 255 })
    txtDe: string | null;

    @ApiProperty({ name: 'txtCopiaOculta', description: 'Cópia oculta' })
    @Column("varchar2", { name: "TXT_COPIA_OCULTA", nullable: true, length: 255 })
    txtCopiaOculta: string | null;

    @ApiProperty({ name: 'txtAssunto', description: '•	Título do e-mail.' })
    @Column("varchar2", { name: "TXT_COPIA", nullable: true, length: 255 })
    txtCopia: string | null;

    @ApiProperty({
        name: 'txtAssunto',
        type: String
    })
    @Column("varchar2", { name: "TXT_ASSUNTO", nullable: true, length: 255 })
    txtAssunto: string | null;


    @ApiProperty({ name: 'codMensagemTipo', description: '•	Identificador do modelo de mensagem de e-mail.' })
    @Column("number", {
        name: "COD_MENSAGEM_TIPO",
        scale: 0,
        default: () => "(1)",
    })
    codMensagemTipo: number;


    @ApiProperty({ name: 'codEnviado', description: 'Código = 0 email não enviado, código = 1 email enviado' })
    @Column("number", { name: "COD_ENVIADO", scale: 0, default: () => "(0)" })
    codEnviado: number;

    @ApiProperty({
        name: 'txtConfig',
        type: String,
        description: 'Campo obrigatório para verificar modelo de email.'
    })

    txtConfig: string;
}
