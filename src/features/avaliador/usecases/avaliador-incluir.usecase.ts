import { BadRequestException } from '@nestjs/common';

import { ApiResponse } from '@libs/common/services/api-response';
import { IAvaliadorRepository } from '../repositories/avaliador.repository';
import { AvaliadorEntity } from '../models/entities/avaliador.entity';
import { AvaliadorIncluirInputDto, AvaliadorIncluirOutputDto } from '../models/dto/avaliador-incluir/avaliador-incluir.dto';
import { MSG } from '@libs/common/services/api-messages';

export class AvaliadorIncluirUseCase {

    constructor(public avaliadorRepository: IAvaliadorRepository, public apiResponse: ApiResponse) { }

    public async handle(input: AvaliadorIncluirInputDto): Promise<AvaliadorIncluirOutputDto> {

        try {
            const result = await this.avaliadorRepository.save([<AvaliadorEntity>input]);
            return result[0];
        } catch (error) {
            throw new BadRequestException((error.response?.status)
                ? error.response?.status
                : fnCatchError(error, input, this));
        }
    }
}

function dto(result: AvaliadorEntity): AvaliadorIncluirOutputDto {
    return { ...result };
}

function fnCatchError(error, input, thiss: AvaliadorIncluirUseCase) {
    return thiss.apiResponse.handler({
        objMessage: MSG.DEFAULT_FALHA,
        error: {
            message: error.message,
            context: {
                className: 'AvaliadorIncluirDto',
                methodName: 'fnIncluirAvaliador',
                input: input,
                output: error
            }
        }
    });
}