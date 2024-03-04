import { BadRequestException } from '@nestjs/common';

import { ApiResponse } from '@libs/common/services/api-response';
import { IUsuarioRepository } from '../repositories/usuario.repository';
import { UsuarioEntity } from '../models/entities/usuario.entity';
import { UsuarioIncluirInputDto, UsuarioIncluirOutputDto } from '../models/dto/usuario-incluir/usuario-incluir.dto';
import { MSG } from '@libs/common/services/api-messages';

export class UsuarioIncluirUseCase {
    readonly LOG_CLASS_NAME = 'UsuarioIncluirUseCase'

    constructor(public usuarioRepository: IUsuarioRepository, public apiResponse: ApiResponse) { }

    public async handle(input: UsuarioIncluirInputDto): Promise<UsuarioIncluirOutputDto> {

        try {
            const result = await this.usuarioRepository.save([<UsuarioEntity>input]);
            return dto(result[0]);
        } catch (error) {
            throw new BadRequestException((error.response?.status)
                ? error.response?.status
                : fnCatchError(error, input, this));
        }
    }
}

function dto(result: UsuarioEntity): UsuarioIncluirOutputDto {
    return { ...result };
}

function fnCatchError(error, input, thiss: UsuarioIncluirUseCase) {
    return thiss.apiResponse.handler({
        objMessage: MSG.DEFAULT_FALHA,
        error: {
            message: error.message,
            context: {
                className: thiss.LOG_CLASS_NAME,
                methodName: thiss.handle.name,
                input: input,
                output: error
            }
        }
    });
}