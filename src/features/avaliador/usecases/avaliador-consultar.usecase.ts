import { BadRequestException } from '@nestjs/common';

import { ApiResponse } from '@libs/common/services/api-response';
import { MSG } from '@sd-root/libs/common/src/services/code-messages';
import { AvaliadorConsultarInputDto, AvaliadorConsultarOutputDto } from '../models/dto/avaliador-consultar.dto';
import { AvaliadorEntity } from '../models/entities/avaliador.entity';
import { IAvaliadorRepository } from '../repositories/avaliador.repository';

export class AvaliadorConsultarUseCase {
    readonly LOG_CLASS_NAME = 'AvaliadorConsultarUseCase'

    public apiResponse: ApiResponse = new ApiResponse();

    constructor(public uRepository: IAvaliadorRepository) {
        this.apiResponse = new ApiResponse()
    }

    public async handle(input: AvaliadorConsultarInputDto): Promise<AvaliadorConsultarOutputDto[]> {

        try {
            const result = await this.uRepository.find({ where: input, loadRelationIds: true });
            return result;
        } catch (error) {
            throw new BadRequestException((error.response?.status)
                ? error.response?.status
                : fnCatchError(error, input, this));
        }
    }
}

function dto(result: AvaliadorEntity): AvaliadorConsultarOutputDto {
    return { ...result };
}

function fnCatchError(error, input, thiss: AvaliadorConsultarUseCase) {
    return thiss.apiResponse.handler({
        objMessage: MSG.DEFAULT_FALHA,
        error: {
            message: error.message,
            context: {
                className: thiss.LOG_CLASS_NAME,
                methodName: thiss.handle.name,
                input: input,
                output:  error
            }
        }
    });
}