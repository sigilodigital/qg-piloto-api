import { Body, Controller, Get, Next, Post, Response } from '@nestjs/common';
import { AuthCertService } from './login-cert.service';
import { ApiResponse } from '@sd-root/libs/common/src/services/response-handler-v1';

@Controller('auth-cert')
export class LoginCertController {
    constructor(private readonly loginCertService: AuthCertService) { }

    // @UseGuards(JwtAuthGuard)
    @Get('authenticationStart')
    async authenticationStart(@Response() response, @Next() next) {

        const result = await this.loginCertService.authenticationStart(next);

        // return ApiResponse.handler({ codNumber: 40, objSaida: result });
        response.send(ApiResponse.handler({ codMessage: 40, output: result }));

    }

    // @UseGuards(JwtAuthGuard)
    @Post('authenticationComplete')
    async authenticationComplete(@Body() body) {

        const result = await this.loginCertService.authenticationComplete(body);

        return ApiResponse.handler({ codMessage: 40, output: result });
    }

    // @UseGuards(JwtAuthGuard)
    @Post('authenticationLogin')
    async authenticationLogin(@Body() body) {

        const cert = await this.loginCertService.authenticationComplete(body);

        const result = await this.loginCertService.authenticationLogin(cert.pkiBrazil.cnpj || cert.pkiBrazil.cpf);

        return ApiResponse.handler({ codMessage: 40, output: result });
    }

    // @UseGuards(JwtAuthGuard)
    @Post('certificado-usuario-externo-verificar')
    async certificadoUsuarioExternoVerificar(@Body() body) {

        const cert = await this.loginCertService.authenticationComplete(body);

        const result = await this.loginCertService.certificadoUsuarioExternoVerificar(cert.pkiBrazil.cnpj || cert.pkiBrazil.cpf);

        return (result)
            ? ApiResponse.handler({ codMessage: 10, output: result })
            : ApiResponse.handler({ codMessage: 9, output: cert });
    }

}
