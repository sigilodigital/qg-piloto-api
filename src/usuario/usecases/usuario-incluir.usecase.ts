import { BadRequestException } from '@nestjs/common';

import { ApiResponse } from '@sd-root/libs/common/src/services/response-handler-v1';
import { IUsuarioRepository } from '../repositories/usuario-repository';
import { UsuarioEntity } from '../models/entities/usuario.entity';
import { UsuarioIncluirInputDto, UsuarioIncluirOutputDto } from '../models/dto/usuario-incluir/usuario-incluir.dto';

export class UsuarioIncluirUseCase {

    constructor(public usuarioRepository: IUsuarioRepository) { }

    public async handle(input: UsuarioIncluirInputDto): Promise<UsuarioIncluirOutputDto> {

        try {
            const result = await this.usuarioRepository.save(<UsuarioEntity>input);
            return result;
        } catch (error) {
            throw new BadRequestException((error.response?.status)
                ? error.response?.status
                : fnCatchError(error, input));
        }
    }
}

function dto(result: UsuarioEntity): UsuarioIncluirOutputDto {
    return { ...result };
}

function fnCatchError(error, input) {
    return ApiResponse.handler({
        codMessage: 60,
        error: {
            message: error.message,
            context: {
                input: input,
                output: {
                    className: 'UsuarioIncluirDto',
                    methodName: 'fnIncluirUsuario',
                    objectError: error
                }
            }
        }
    });
}