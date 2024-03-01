import { HttpException, HttpStatus } from '@nestjs/common';
import { NextFunction } from 'express';

import { MSG } from '@sd-root/libs/common/src/services/api-messages';
import { ApiResponse } from '@sd-root/libs/common/src/services/api-response-static';
import { IPkiService } from '../../services/pki.service';

export class LoginCertStartUseCase {
    LOG_CLASS_NAME = 'LoginCertStartUseCase';

    constructor(private pkiService: IPkiService) { }

    async handle(next: NextFunction) {
        try {
            const token = await this.pkiService.getPkiToken(next);
            return { token };
        } catch (error) {
            fnCatchError(error, this);
        }
    }

}

function fnCatchError(error, thiss: LoginCertStartUseCase) {
    throw new HttpException(ApiResponse.handler({
        objMessage: MSG.DEFAULT_FALHA,

        error: {
            message: error.message,
            context: {
                className: thiss.LOG_CLASS_NAME,
                methodName: thiss.handle.name,
            },
        }
    }), HttpStatus.UNAUTHORIZED);
}