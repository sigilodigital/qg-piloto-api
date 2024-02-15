import { ApiResponse, IApiResponseMessage } from '@libs/common/services/response-handler';
import { HttpException, Injectable } from '@nestjs/common';

export interface IExceptionHttpService extends IApiResponseMessage<any, any> { 
    httpStatusCode: number, 
    errMessage: string; 
}

@Injectable()
export class ExceptionHttpService {

    static createException(input: IExceptionHttpService['input']) {
        const apiResponse = new ApiResponse();

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
