import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { ApiResponse } from '@libs/common/services/response-handler';
import { ValidationPipe } from '@libs/common/validations/validation.pipe';
import { UsuarioService } from './usuario.service';
import { UsuarioDoc } from './docs/usuario.doc';
import { UsuarioIncluirDto } from './models/dto/usuario-incluir.dto';
import { UsuarioEntity } from './models/entities/usuario.entity';
import { IUsuarioConsultarDto, UsuarioConsultarDto } from './models/dto/usuario-consultar.dto';

@ApiTags(UsuarioDoc.title)
@Controller('usuario')
export class UsuarioController {

    constructor(private readonly usuarioService: UsuarioService) { }

    @ApiOperation(UsuarioDoc.incluir())
    @ApiBody({ type: UsuarioIncluirDto })
    @Post('incluir')
    async usuarioIncluir(@Body(new ValidationPipe()) input: UsuarioIncluirDto, @Req() request: Request) {
        const usuario: UsuarioEntity = await this.usuarioService.usuarioIncluir(input, request);
        return ApiResponse.handler({ codNumber: 40, output: null });
    }

    @ApiOperation(UsuarioDoc.consultar())
    @ApiBody({ type: UsuarioConsultarDto })
    @Post('consultar')
    async usuarioConsultar(@Body(new ValidationPipe()) input: UsuarioConsultarDto, @Req() request?: Request) {
        const result: IUsuarioConsultarDto['output'][] = await this.usuarioService.usuarioConsultar(input, request);
        return ApiResponse.handler({ codNumber: 15, output: result });
    }

}
