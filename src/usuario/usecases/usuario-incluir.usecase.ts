import { BadRequestException } from '@nestjs/common';

import { ApiResponse } from '@libs/common/services/response-handler';
import { IUsuarioRepository } from '../repositories/usuario-repository';
import { UsuarioEntity } from '../models/entities/usuario.entity';
import { UsuarioIncluirInputDto, UsuarioIncluirOutputDto } from '../models/dto/usuario-incluir.dto';

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
        codNumber: 60,
        outputError: {
            message: error.message,
            context: {
                input: input,
                output: {
                    className: 'UsuarioIncluirDto',
                    methodName: 'fnIncluirUsuario',
                    objectErro: error
                }
            }
        }
    });
}