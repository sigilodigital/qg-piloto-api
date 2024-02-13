import { BadRequestException } from '@nestjs/common';

import { ApiResponse } from '@sd-root/libs/common/src/services/response-handler-v1';
import { IUsuarioRepository } from '../repositories/usuario-repository';
import { UsuarioEntity } from '../models/entities/usuario.entity';
import { UsuarioConsultarInputDto, UsuarioConsultarOutputDto } from '../models/dto/usuario-consultar.dto';

export class UsuarioConsultarUseCase {

    constructor(public uRepository: IUsuarioRepository) { }

    public async handle(input: UsuarioConsultarInputDto): Promise<UsuarioConsultarOutputDto[]> {

        try {
            const result = await this.uRepository.find({ where: input, loadRelationIds: true });
            // const result = await this.uRepository.findBy(input);
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
        codMessage: 60,
        error: {
            message: error.message,
            context: {
                input: input,
                output: {
                    className: 'UsuarioConsultarDto',
                    methodName: 'fnConsultarUsuario',
                    objectError: error
                }
            }
        }
    });
}