
import { ApiProperty } from '@nestjs/swagger';
import { Validate, ValidateIf } from 'class-validator';
import { IAPIResponse } from '@libs/common/services/response-handler';
import { ValidaCampoPorSchema } from 'src/shared/validation/classes/validaCampoPorSchema';
import { ValidaPerguntaSecretaExistente } from 'src/shared/validation/classes/validaPerguntaSecretaExistente';
type PerguntaSecretaType = IPerguntaSecreta['input'];
export interface IPerguntaSecreta {
    input: {
        codInteressado: number;
        codTipoLembrancaSenha: number;
        codPerguntaSecreta: number;
        txtRespostaPerguntaSecreta: string;
    }

    output: {
        mensagem: IAPIResponse<any>;
    }
}
export class PerguntaSecretaDto implements PerguntaSecretaType {

    @ApiProperty({ name: 'codInteressado', type: Number })
    @Validate(ValidaCampoPorSchema)
    codInteressado: number;

    @ApiProperty({ name: 'codTipoLembrancaSenha', type: Number })
    @ValidateIf((obj, value) => {
        return value != undefined
    })
    @Validate(ValidaCampoPorSchema)
    codTipoLembrancaSenha: number;

    @ApiProperty({ name: 'codPerguntaSecreta', type: Number })
    @Validate(ValidaPerguntaSecretaExistente)
    @Validate(ValidaCampoPorSchema)
    @ValidateIf((object: any, value: any) => {
        if (object['codTipoLembrancaSenha'] == 1) {
            return true
        } else return false
    })
    codPerguntaSecreta: number;

    @ApiProperty({ name: 'txtRespostaPerguntaSecreta', type: String })
    @Validate(ValidaCampoPorSchema)
    @ValidateIf((object: any, value: any) => {
        if (object['codTipoLembrancaSenha'] == 1) {
            return true
        } else return false
    })
    txtRespostaPerguntaSecreta: string;
}