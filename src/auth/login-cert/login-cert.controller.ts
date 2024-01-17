import { Body, Controller, Get, Next, Post, Response } from '@nestjs/common';
import { AuthCertService } from './login-cert.service';
import { ApiResponse } from '@libs/common/services/response-handler';

@Controller('auth-cert')
export class LoginCertController {
    constructor(private readonly loginCertService: AuthCertService) { }

    // @UseGuards(JwtAuthGuard)
    @Get('authenticationStart')
    async authenticationStart(@Response() response, @Next() next) {

        const result = await this.loginCertService.authenticationStart(next);

        // return ApiResponse.handler({ codNumber: 40, objSaida: result });
        response.send(ApiResponse.handler({ codNumber: 40, output: result }));

    }

    // @UseGuards(JwtAuthGuard)
    @Post('authenticationComplete')
    async authenticationComplete(@Body() body) {

        const result = await this.loginCertService.authenticationComplete(body);

        return ApiResponse.handler({ codNumber: 40, output: result });
    }

    // @UseGuards(JwtAuthGuard)
    @Post('authenticationLogin')
    async authenticationLogin(@Body() body) {

        const cert = await this.loginCertService.authenticationComplete(body);

        const result = await this.loginCertService.authenticationLogin(cert.pkiBrazil.cnpj || cert.pkiBrazil.cpf);

        return ApiResponse.handler({ codNumber: 40, output: result });
    }

    // @UseGuards(JwtAuthGuard)
    @Post('certificado-usuario-externo-verificar')
    async certificadoUsuarioExternoVerificar(@Body() body) {

        const cert = await this.loginCertService.authenticationComplete(body);

        const result = await this.loginCertService.certificadoUsuarioExternoVerificar(cert.pkiBrazil.cnpj || cert.pkiBrazil.cpf);

        return (result)
            ? ApiResponse.handler({ codNumber: 10, output: result })
            : ApiResponse.handler({ codNumber: 9, output: cert });
    }

}
