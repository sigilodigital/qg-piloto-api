import { BadRequestException } from '@nestjs/common';

import { ApiResponse } from '@sd-root/libs/common/src/services/response-handler';
import { IUsuarioRepository } from '../repositories/usuario-repository';
import { UsuarioEntity } from '../models/entities/usuario.entity';
import { UsuarioIncluirInputDto, UsuarioIncluirOutputDto } from '../models/dto/usuario-incluir/usuario-incluir.dto';
import { MSG } from '@sd-root/libs/common/src/services/code-messages';

export class UsuarioIncluirUseCase {

    constructor(public usuarioRepository: IUsuarioRepository, public apiResponse: ApiResponse<any,any>) { }

    public async handle(input: UsuarioIncluirInputDto): Promise<UsuarioIncluirOutputDto> {

        try {
            const result = await this.usuarioRepository.save(<UsuarioEntity>input);
            return result;
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
                className: 'UsuarioIncluirDto',
                methodName: 'fnIncluirUsuario',
                input: input,
                output: error
            }
        }
    });
}