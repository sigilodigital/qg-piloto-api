
import { HttpException, HttpStatus } from '@nestjs/common';
import { NextFunction } from 'express';
import { IPkiService } from '../../services/pki.service';
import { ApiResponse } from '@sd-root/libs/common/src/services/response-handler-v1';

export class LoginCertStartUseCase {

    constructor(private pkiService: IPkiService) { }

    async handle(next: NextFunction) {
        try {
            const token = await this.pkiService.getPkiToken(next);
            return { token };
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