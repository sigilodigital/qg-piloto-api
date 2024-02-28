import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse as ApiResponseSwagger, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { MSG } from '@libs/common/services/code-messages';
import { ApiResponse } from '@libs/common/services/response-handler';
import { ValidationPipe } from '@libs/common/validations/validation.pipe';
import { AvaliadorDoc } from './docs/avaliador.doc';
import { AvaliadorConsultarInputDto, AvaliadorConsultarOutputDto } from './models/dto/avaliador-consultar.dto';
import { AvaliadorIncluirInputDto, AvaliadorIncluirOutputDto } from './models/dto/avaliador-incluir/avaliador-incluir.dto';
import { AvaliadorService } from './avaliador.service';

@ApiTags(AvaliadorDoc.title)
@Controller('avaliador')
export class AvaliadorController {

    private apiResponse: ApiResponse;

    constructor(private readonly avaliadorService: AvaliadorService) {
        this.apiResponse = new ApiResponse();
    }

    @ApiOperation(AvaliadorDoc.incluir())
    @ApiBody({ type: AvaliadorIncluirInputDto })
    @Post('incluir')
    async avaliadorIncluir(@Body(new ValidationPipe()) input: AvaliadorIncluirInputDto, @Req() request: Request) {
        const result: AvaliadorIncluirOutputDto = await this.avaliadorService.avaliadorIncluir(input, request);
        return this.apiResponse.handler({ objMessage: MSG.DEFAULT_SUCESSO, output: result });
    }

    @ApiOperation(AvaliadorDoc.consultar())
    @ApiBody({ type: AvaliadorConsultarInputDto })
    @ApiResponseSwagger({ type: AvaliadorConsultarOutputDto })
    @Post('consultar')
    async avaliadorConsultar(@Body(new ValidationPipe()) input: AvaliadorConsultarInputDto) {
        const result: AvaliadorConsultarOutputDto[] = await this.avaliadorService.avaliadorConsultar(input);
        return this.apiResponse.handler({ objMessage: MSG.DEFAULT_SUCESSO, output: result });
    }

}
