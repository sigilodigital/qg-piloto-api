import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse as ApiResponseSwagger, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { MSG } from '@libs/common/services/code-messages';
import { ApiResponse } from '@libs/common/services/response-handler';
import { ValidationPipe } from '@libs/common/validations/validation.pipe';
import { UsuarioDoc } from './docs/usuario.doc';
import { UsuarioConsultarInputDto, UsuarioConsultarOutputDto } from './models/dto/usuario-consultar.dto';
import { UsuarioIncluirInputDto, UsuarioIncluirOutputDto } from './models/dto/usuario-incluir/usuario-incluir.dto';
import { UsuarioService } from './usuario.service';

@ApiTags(UsuarioDoc.title)
@Controller('usuario')
export class UsuarioController {

    private apiResponse: ApiResponse;

    constructor(private readonly usuarioService: UsuarioService) {
        this.apiResponse = new ApiResponse();
    }

    @ApiOperation(UsuarioDoc.incluir())
    @ApiBody({ type: UsuarioIncluirInputDto })
    @Post('incluir')
    async usuarioIncluir(@Body(new ValidationPipe()) input: UsuarioIncluirInputDto, @Req() request: Request) {
        const result: UsuarioIncluirOutputDto = await this.usuarioService.usuarioIncluir(input, request);
        return this.apiResponse.handler({ objMessage: MSG.DEFAULT_SUCESSO, output: result });
    }

    @ApiOperation(UsuarioDoc.consultar())
    @ApiBody({ type: UsuarioConsultarInputDto })
    @ApiResponseSwagger({ type: UsuarioConsultarOutputDto })
    @Post('consultar')
    async usuarioConsultar(@Body(new ValidationPipe()) input: UsuarioConsultarInputDto) {
        const result: UsuarioConsultarOutputDto[] = await this.usuarioService.usuarioConsultar(input);
        return this.apiResponse.handler({ objMessage: MSG.DEFAULT_SUCESSO, output: result });
    }

}
