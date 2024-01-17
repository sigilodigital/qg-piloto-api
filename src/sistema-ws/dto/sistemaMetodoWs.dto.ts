import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity } from "typeorm";

@Entity("TBL_SEG_SISTEMA_METODO_WS", { schema: 'IUSR_PROTON' })
export class SistemaMetodoDto {
    
    @ApiProperty({ name: 'codSegSistemaWs', type: Number, required: true })
    @Column("number", { name: 'COD_SEG_SISTEMA_WS', primary: true })
    codSegSistemaWs: number;

    @ApiProperty({ name: 'codSegMetodoWs', type: Number })
    @Column("number", { name: 'COD_SEG_METODO_WS', primary: true })
    codSegMetodoWs: number;

}