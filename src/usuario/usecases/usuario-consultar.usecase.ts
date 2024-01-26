import { BadRequestException } from '@nestjs/common';

import { ApiResponse } from '@libs/common/services/response-handler';
import { IUsuarioRepository } from '../repositories/usuario-repository';
import { UsuarioEntity } from '../models/entities/usuario.entity';
import { UsuarioConsultarInputDto, UsuarioConsultarOutputDto } from '../models/dto/usuario-consultar.dto';

export class UsuarioConsultarUseCase {

    constructor(public uRepository: IUsuarioRepository) { }

    public async handle(input: UsuarioConsultarInputDto): Promise<UsuarioConsultarOutputDto[]> {

        try {
            const result = await this.uRepository.findBy(input);
            return result;
        } catch (error) {
            throw new BadRequestException((error.response?.status)
                ? error.response?.status
                : fnCatchError(error, input));
        }
    }
}

function dto(result: UsuarioEntity): UsuarioConsultarOutputDto {
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
                    className: 'UsuarioConsultarDto',
                    methodName: 'fnConsultarUsuario',
                    objectErro: error
                }
            }
        }
    });
}