import { ValidationPipe } from '@libs/common/validations/validation.pipe';
import { Body, Controller, HttpException, HttpStatus, Post, Request, Response, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Response as IResponse } from 'express';
import { PerguntaSecretaDto } from 'src/auth/models/dto/perguntaSecreta.dto';
import { JwtAuthSystemGuard } from 'src/auth/guards/jwt-auth-system.guard';
import { IUsuarioExternoLembracaSenhaConsultar, UsuarioExternoLembracaSenhaConsultar } from './dto/usuario-externo-lembranca-senha-consultar.dto';
import { IUsuarioExternoSenhaEmailRecuperar, UsuarioExternoSenhaEmailRecuperar } from './dto/usuario-externo-senha-email-recuperar.dto';
import { IUsuarioExternoSenhaPerguntaSecretaRecuperar, UsuarioExternoSenhaPerguntaSecretaRecuperar } from './dto/usuario-externo-senha-pergunta-secreta-recuperar.dto';
import { IUsuarioExternoSenhaAlterar, UsuarioExternoSenhaAlterar } from './dto/usuario-externo-senha-senha-alterar.dto';
import { RecuperacaoSenhaService } from './recuperacao-senha.service';
import { ApiResponse } from '@libs/common/services/response-handler';

@Controller('recuperacao-senha')
export class RecuperacaoSenhaController {
    constructor(
        private readonly recuperacaoSenhaService: RecuperacaoSenhaService
    ) { }

    @ApiBody({ type: PerguntaSecretaDto })
    @UseGuards(JwtAuthSystemGuard)
    @Post('usuario-externo-lembranca-senha-alterar')
    async usuarioExternoLembrancaSenhaAlterar(@Body(new ValidationPipe()) perguntaSecreta: PerguntaSecretaDto, @Request() req?: any, @Response() res?: IResponse) {        
        if (perguntaSecreta.codTipoLembrancaSenha === 1) {
            if (!perguntaSecreta.codPerguntaSecreta)
                campoNaoInformadoException('codPerguntaSecreta');
            if (!perguntaSecreta.txtRespostaPerguntaSecreta)
                campoNaoInformadoException('txtRespostaPerguntaSecreta');
        }

        const resultadoValidaPerguntaSecreta = await this.recuperacaoSenhaService.usuarioExternoLembrancaSenhaAlterar(perguntaSecreta, req);

        return res.json(resultadoValidaPerguntaSecreta);

        function campoNaoInformadoException(property: string) {
            throw new HttpException(ApiResponse.handler({
                codNumber: 1,
                property,
                output: undefined
            }), HttpStatus.BAD_REQUEST);
        }
    }

    @ApiBody({ type: UsuarioExternoSenhaPerguntaSecretaRecuperar })
    @UseGuards(JwtAuthSystemGuard)
    @Post('usuario-externo-senha-pergunta-secreta-recuperar')
    async usuarioExternoSenhaPerguntaSecretaRecuperar(@Body(new ValidationPipe()) usuarioExternoSenhaPerguntaSecretaRecuperar: UsuarioExternoSenhaPerguntaSecretaRecuperar, @Request() req: any, @Response() res: IResponse ) {
        const resultadoValidaPerguntaSecretaReculperar = await this.recuperacaoSenhaService.usuarioExternoSenhaPerguntaSecretaRecuperar(usuarioExternoSenhaPerguntaSecretaRecuperar, req);
        return res.json(resultadoValidaPerguntaSecretaReculperar);
    }

    @UseGuards(JwtAuthSystemGuard)
    @Post('usuario-externo-senha-email-recuperar')
    async usuarioExternoSenhaEmailRecuperar(@Request() req: any, @Response() res: IResponse, @Body() usuarioExternoSenhaEmailRecuperar: IUsuarioExternoSenhaEmailRecuperar['input']) {
        await (new ValidationPipe()).transform(usuarioExternoSenhaEmailRecuperar, { type: 'param', data: 'usuarioExternoSenhaEmailRecuperar', metatype: UsuarioExternoSenhaEmailRecuperar });

        const ResultUsuarioExternoSenhaEmailRecuperar = await this.recuperacaoSenhaService.usuarioExternoSenhaEmailRecuperar(usuarioExternoSenhaEmailRecuperar, req);
        return res.json(ResultUsuarioExternoSenhaEmailRecuperar);
    }

    @ApiBody({ type: UsuarioExternoSenhaAlterar })
    @UseGuards(JwtAuthSystemGuard)
    @Post('usuario-externo-senha-alterar')
    async usuarioExternoSenhaAlterar(@Request() req: any, @Response() res: IResponse, @Body() usuarioExternoSenhaAlterar: IUsuarioExternoSenhaAlterar['input']) {
        await (new ValidationPipe()).transform(usuarioExternoSenhaAlterar, { type: 'param', data: 'usuarioExternoSenhaAlterar', metatype: UsuarioExternoSenhaAlterar });
    
        const usuarioExternoSenhaAlterarUpd = await this.recuperacaoSenhaService.usuarioExternoSenhaAlterar(usuarioExternoSenhaAlterar, req);

        return res.json(usuarioExternoSenhaAlterarUpd);
    }

    @ApiBody({ type: UsuarioExternoLembracaSenhaConsultar })
    @UseGuards(JwtAuthSystemGuard)
    @Post('usuario-externo-lembranca-senha-consultar')
    async usuarioExternoLembrancaSenhaConsultar(@Request() req: any, @Response() res: IResponse, @Body() usuarioExternoLembracaSenhaConsultarInput: IUsuarioExternoLembracaSenhaConsultar['input']) {
        if (req.user['status']) { return res.json(req.user); }

        const validacao = await (new ValidationPipe()).transform(usuarioExternoLembracaSenhaConsultarInput, { type: 'param', data: 'usuarioExternoLembracaSenhaConsultar', metatype: UsuarioExternoLembracaSenhaConsultar });
        if (validacao['status']) { return validacao; }

        const userExternoConsultar = await this.recuperacaoSenhaService.usuarioExternoLembrancaSenhaConsultar(usuarioExternoLembracaSenhaConsultarInput);

        return res.json(userExternoConsultar);
    }


}
