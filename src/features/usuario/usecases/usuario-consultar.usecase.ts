import { BadRequestException } from '@nestjs/common';

import { ApiResponse } from '@libs/common/services/response-handler';
import { MSG } from '@sd-root/libs/common/src/services/code-messages';
import { UsuarioConsultarInputDto, UsuarioConsultarOutputDto } from '../models/dto/usuario-consultar.dto';
import { UsuarioEntity } from '../models/entities/usuario.entity';
import { IUsuarioRepository } from '../repositories/usuario.repository';

export class UsuarioConsultarUseCase {
    readonly LOG_CLASS_NAME = 'UsuarioConsultarUseCase'

    public apiResponse: ApiResponse = new ApiResponse();

    constructor(public uRepository: IUsuarioRepository) {
        this.apiResponse = new ApiResponse()
    }

    public async handle(input: UsuarioConsultarInputDto): Promise<UsuarioConsultarOutputDto[]> {

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

function dto(result: UsuarioEntity): UsuarioConsultarOutputDto {
    return { ...result };
}

function fnCatchError(error, input, thiss: UsuarioConsultarUseCase) {
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