import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags, ApiResponse as ApiResponseSwagger } from '@nestjs/swagger';
import { Request } from 'express';

import { ApiResponse } from '@libs/common/services/response-handler';
import { ValidationPipe } from '@libs/common/validations/validation.pipe';
import { UsuarioService } from './usuario.service';
import { UsuarioDoc } from './docs/usuario.doc';
import { UsuarioIncluirInputDto, UsuarioIncluirOutputDto } from './models/dto/usuario-incluir.dto';
import { UsuarioEntity } from './models/entities/usuario.entity';
import { UsuarioConsultarInputDto, UsuarioConsultarOutputDto} from './models/dto/usuario-consultar.dto';
import { CodigoAcaoEnum } from '@libs/common/enumerations/codigo-acao.enum';

@ApiTags(UsuarioDoc.title)
@Controller('usuario')
export class UsuarioController {

    constructor(private readonly usuarioService: UsuarioService) { }

    @ApiOperation(UsuarioDoc.incluir())
    @ApiBody({ type: UsuarioIncluirInputDto })
    @Post('incluir')
    async usuarioIncluir(@Body(new ValidationPipe()) input: UsuarioIncluirInputDto, @Req() request: Request) {
        const result: UsuarioIncluirOutputDto = await this.usuarioService.usuarioIncluir(input, request);
        return ApiResponse.handler({ codNumber: CodigoAcaoEnum.USUARIO_INCLUIR, output: result });
    }

    @ApiOperation(UsuarioDoc.consultar())
    @ApiBody({ type: UsuarioConsultarInputDto })
    @ApiResponseSwagger({type: UsuarioConsultarOutputDto})
    @Post('consultar')
    async usuarioConsultar(@Body(new ValidationPipe()) input: UsuarioConsultarInputDto) {
        const result: UsuarioConsultarOutputDto[] = await this.usuarioService.usuarioConsultar(input);
        return ApiResponse.handler({ codNumber: CodigoAcaoEnum.USUARIO_ALTERAR, output: result });
    }

}
