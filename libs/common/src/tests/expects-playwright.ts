import { BadRequestException, HttpException } from "@nestjs/common";
import { Expect, Response } from '@playwright/test';

import { MSG } from "../services/code-messages";

export class SDExpectPlaywright {
    
    static async fnDtoAndLog(res: Response) {
        const body = await res.json();
        const status = res.status();
        const statusText = res.statusText();
        const headers = res.headers();

        console.log('Body', body);
        console.log('Status', status, statusText);
        console.log('Headers', headers);

        return { body, status, headers };
    }
    static async fnNotCatchError(error: any, expect: Expect) {
        expect(error).not.toBeInstanceOf(Error);
        expect(error).not.toBeInstanceOf(HttpException);
    }

    static async fnCatchErrorDefault(error: any, expect: Expect) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(HttpException);
        expect(error).toBeInstanceOf(BadRequestException);
    }

    static async fnCatchErrorForRequired(error: any, expect: Expect) {
        expect(error.response).toHaveProperty('status.statusCode', MSG.ERR_FIELD_N_INFO.code);
    }

    static async fnCatchErrorForSize(error: any, expect: Expect) {
        expect(error.response).toHaveProperty('status.statusCode', MSG.ERR_FIELD_TAM.code);
    }

    static async fnCatchErrorForType(error: any, expect: Expect) {
        expect(error.response).toHaveProperty('status.statusCode', MSG.ERR_FIELD_TIPO.code);
    }

    static async fnCatchErrorForValue(error: any, expect: Expect) {
        expect(error.response).toHaveProperty('status.statusCode', MSG.ERR_FIELD_VALOR.code);
    }

};