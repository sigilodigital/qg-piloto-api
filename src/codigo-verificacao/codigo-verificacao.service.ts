import { Injectable } from '@nestjs/common';
import { AppDataSource } from 'src/database';
import { ICreateCodigoVerificacaoDto, } from './dto/create-codigo-verificacao.dto';
import { UpdateCodigoVerificacaoDto } from './dto/update-codigo-verificacao.dto';
import { ApiResponse } from '@libs/common/services/response-handler';
import { CodigoVerificacaoEntity } from './entities/codigo-verificacao.entity';

@Injectable()
export class CodigoVerificacaoService {
    private className = "CodigoVerificacaoService";

    async create(createCodigoVerificacaoDto: ICreateCodigoVerificacaoDto['input']) {
        const methodName = "async create(createCodigoVerificacaoDto: ICreateCodigoVerificacaoDto['input'])";

        try {
            createCodigoVerificacaoDto.codCodigoVerificacaoPessoa = (await AppDataSource.manager
                .query('SELECT S_TBL_CODIGO_VERIFICACAO_PESSOA.NEXTVAL FROM DUAL'))[0].NEXTVAL;

            const data = await AppDataSource.getRepository(CodigoVerificacaoEntity)
                .createQueryBuilder('TBL_CODIGO_VERIFICACAO_PESSOA')
                .insert()
                .into(CodigoVerificacaoEntity)
                .values(createCodigoVerificacaoDto)
                .execute();

            return ApiResponse.handler({
                codNumber: 17,
                valueArg: 'Registro salvo!',
                property: 'Código verificação',
                input: createCodigoVerificacaoDto,
                output: data,
                outputError: undefined
            });
        } catch (error) {
            return ApiResponse.handler({
                codNumber: 43,
                valueArg: 'Erro!',
                property: 'Código verificação',
                input: createCodigoVerificacaoDto,
                output: null,
                outputError: {
                    message: error.message,
                    context: {
                        input: createCodigoVerificacaoDto,
                        output: {
                            className: this.className,
                            methodName: methodName
                        }
                    }
                }
            });
        }
    }

    async validar(codigoVerificacaoDto: ICreateCodigoVerificacaoDto['input']) {
        if (!codigoVerificacaoDto)
            return ApiResponse.handler({
                codNumber: 16,
                valueArg: 'Dados incompletos',
                property: 'Código verificação',
                input: codigoVerificacaoDto,
                output: null,
                outputError: undefined
            });

        const data = await AppDataSource.getRepository(CodigoVerificacaoEntity)
            .createQueryBuilder('TBL_CODIGO_VERIFICACAO_PESSOA')
            .where(codigoVerificacaoDto)
            .getOne();

        if (data)
            return ApiResponse.handler({
                codNumber: 15,
                valueArg: 'Registro encontrado',
                property: 'Código verificação',
                input: codigoVerificacaoDto,
                output: data,
                outputError: undefined
            });
        return ApiResponse.handler({
            codNumber: 16,
            valueArg: 'Registro não encontrado',
            property: 'Código verificação',
            input: codigoVerificacaoDto,
            output: data,
            outputError: undefined
        });
    }

    findAll() {
        return `This action returns all codigoVerificacao`;
    }

    findOne(id: number) {
        return `This action returns a #${id} codigoVerificacao`;
    }

    update(id: number, updateCodigoVerificacaoDto: UpdateCodigoVerificacaoDto) {
        return `This action updates a #${id} codigoVerificacao`;
    }

    remove(id: number) {
        return `This action removes a #${id} codigoVerificacao`;
    }
}
