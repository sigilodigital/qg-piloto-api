import { ApiProperty } from '@nestjs/swagger';

export class PerguntaSecretaDto {

    @ApiProperty({ name: 'codInteressado', type: Number })
    codInteressado: number;

    @ApiProperty({ name: 'codTipoLembrancaSenha', type: Number })
    codTipoLembrancaSenha: number;

    @ApiProperty({ name: 'codPerguntaSecreta', type: Number })
    codPerguntaSecreta: number;

    @ApiProperty({ name: 'txtRespostaPerguntaSecreta', type: String })
    txtRespostaPerguntaSecreta: string;
}