import { BadRequestException, HttpException } from "@nestjs/common";

import { MSG } from "../services/code-messages";

export class SDExpectJest {
    static async fnNotCatchError(error: any, expect: jest.Expect) {
        expect(error).not.toBeInstanceOf(Error);
        expect(error).not.toBeInstanceOf(HttpException);
    }

    static async fnCatchErrorDefault(error: any, expect: jest.Expect) {
        expect(error).toBeInstanceOf(Error);
        // expect(error).toBeInstanceOf(HttpException);
        // expect(error).toBeInstanceOf(BadRequestException);
    }

    static async fnCatchErrorForRequired(error: any, expect: jest.Expect) {
        expect(error.response).toHaveProperty('status.statusCode', MSG.ERR_FIELD_N_INFO.code);
    }

    static async fnCatchErrorForSize(error: any, expect: jest.Expect) {
        expect(error.response).toHaveProperty('status.statusCode', MSG.ERR_FIELD_TAM.code);
    }

    static async fnCatchErrorForType(error: any, expect: jest.Expect) {
        expect(error.response).toHaveProperty('status.statusCode', MSG.ERR_FIELD_TIPO.code);
    }

    static async fnCatchErrorForValue(error: any, expect: jest.Expect) {
        expect(error.response).toHaveProperty('status.statusCode', MSG.ERR_FIELD_VALOR.code);
    }

};