import { Injectable } from '@nestjs/common';
import { ICreateCodigoVerificacaoDto, } from './dto/create-codigo-verificacao.dto';
import { UpdateCodigoVerificacaoDto } from './dto/update-codigo-verificacao.dto';
import { ApiResponse } from '@libs/common/services/v1/response-handler-v1';
import { CodigoVerificacaoEntity } from './entities/codigo-verificacao.entity';
import { IUtilRepository, UtilRepository } from '@libs/common/repository/util.repository';

@Injectable()
export class CodigoVerificacaoService {
    private className = "CodigoVerificacaoService";
    private utilRepo: IUtilRepository;
    constructor() {
        this.utilRepo = new UtilRepository();
    }

    async create(createCodigoVerificacaoDto: ICreateCodigoVerificacaoDto['input']) {
        const methodName = "async create(createCodigoVerificacaoDto: ICreateCodigoVerificacaoDto['input'])";

        const u = await this.utilRepo.init([]);
        try {
            createCodigoVerificacaoDto.codCodigoVerificacaoPessoa = (await u.manager
                .query('SELECT S_TBL_CODIGO_VERIFICACAO_PESSOA.NEXTVAL FROM DUAL'))[0].NEXTVAL;

            const data = await u.manager.getRepository(CodigoVerificacaoEntity)
                .createQueryBuilder('TBL_CODIGO_VERIFICACAO_PESSOA')
                .insert()
                .into(CodigoVerificacaoEntity)
                .values(createCodigoVerificacaoDto)
                .execute();

            return ApiResponse.handler({
                codMessage: 17,
                valueArg: 'Registro salvo!',
                property: 'Código verificação',
                input: createCodigoVerificacaoDto,
                output: data,
                error: undefined
            });
        } catch (error) {
            return ApiResponse.handler({
                codMessage: 43,
                valueArg: 'Erro!',
                property: 'Código verificação',
                input: createCodigoVerificacaoDto,
                output: null,
                error: {
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

        const u = await this.utilRepo.init([]);

        if (!codigoVerificacaoDto)
            return ApiResponse.handler({
                codMessage: 16,
                valueArg: 'Dados incompletos',
                property: 'Código verificação',
                input: codigoVerificacaoDto,
                output: null,
                error: undefined
            });

        const data = await u.manager.getRepository(CodigoVerificacaoEntity)
            .createQueryBuilder('TBL_CODIGO_VERIFICACAO_PESSOA')
            .where(codigoVerificacaoDto)
            .getOne();

        if (data)
            return ApiResponse.handler({
                codMessage: 15,
                valueArg: 'Registro encontrado',
                property: 'Código verificação',
                input: codigoVerificacaoDto,
                output: data,
                error: undefined
            });
        return ApiResponse.handler({
            codMessage: 16,
            valueArg: 'Registro não encontrado',
            property: 'Código verificação',
            input: codigoVerificacaoDto,
            output: data,
            error: undefined
        });
    }

}
