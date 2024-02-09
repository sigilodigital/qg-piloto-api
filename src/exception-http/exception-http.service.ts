import { Injectable, HttpException } from '@nestjs/common';
import { ApiResponse, IApiResponseMessage } from '@sd-root/libs/common/src/services/response-handler';
import { IMessage } from '@sd-root/libs/common/src/services/code-messages';

export interface IExceptionHttpService {
    input: { httpStatusCode: number, errMessage: string; } & IApiResponseMessage<any, any>,
    output: {
        message: string;
    };
}
@Injectable()
export class ExceptionHttpService {

    static createException(input: IExceptionHttpService['input']) {
        const apiResponse = new ApiResponse<any, any>();

        throw new HttpException(apiResponse.handler({
            objMessage: input.objMessage,
            property: input.property,
            valueArg: input.valueArg,
            error: {
                message: input.errMessage,
                context: {
                    className: "ExceptionHttpService",
                    methodName: "createException",
                    input: input.input,
                    output: input.output
                }
            }
        }), input.httpStatusCode);
    }
}
