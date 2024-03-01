
import { HttpException, HttpStatus } from '@nestjs/common';
import { IPkiService } from '../../services/pki.service';
import { ApiResponse } from '@sd-root/libs/common/src/services/api-response-static';
import { MSG } from '@sd-root/libs/common/src/services/api-messages';

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
        objMessage: MSG.DEFAULT_FALHA,
    }), HttpStatus.UNAUTHORIZED);
}