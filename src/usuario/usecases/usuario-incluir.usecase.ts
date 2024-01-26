import { BadRequestException } from '@nestjs/common';

import { ApiResponse } from '@libs/common/services/response-handler';
import { IUsuarioIncluirDto } from '../models/dto/usuario-incluir.dto';
import { IUsuarioRepository } from '../repositories/usuario-repository';
import { UsuarioEntity } from '../models/entities/usuario.entity';

export class UsuarioIncluirUseCase {

    constructor(public usuarioRepository: IUsuarioRepository) { }

    public async handle(input: IUsuarioIncluirDto['input']): Promise<IUsuarioIncluirDto['output']> {

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

function dto(result: UsuarioEntity): IUsuarioIncluirDto['output'] {
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