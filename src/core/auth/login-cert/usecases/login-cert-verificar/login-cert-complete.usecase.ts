
import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@sd-root/libs/common/src/services/response-handler-v1';
import { IPkiService } from '../../services/pki.service';

export class LoginCertCompleteUseCase {

    constructor(private pkiService: IPkiService) { }

    async handle(body: { token: string; }) {
        try {
            const cert = await this.pkiService.getPkiCertificate(body);
            return cert;
        } catch (error) {
            fnCatchError(error);
        }
    }

}

function fnCatchError(error) {
    throw new HttpException(ApiResponse.handler({
        codMessage: 60,
    }), HttpStatus.UNAUTHORIZED);
}