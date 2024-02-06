
import { HttpException, HttpStatus } from '@nestjs/common';
import { NextFunction } from 'express';
import { IPkiService } from '../../services/pki.service';
import { ApiResponse } from '@libs/common/services/response-handler';

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