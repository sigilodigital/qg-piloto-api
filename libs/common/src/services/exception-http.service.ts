import { Injectable, HttpException } from '@nestjs/common';
import { ApiResponse } from './response-handler';

export interface IExceptionHttpService {
    input: {
        property: string;
        value: any;
        statusCode: number;
        errorCode: number,
        objError?: {
            message: string,
            context?: {
                input?: object,
                output?: {
                    className?: string;
                    methodName?: string;
                    objError?: object
                }
            }
        };
    },
    output: {
        message: string;
    };
}
@Injectable()
export class ExceptionHttpService {
    className = "ExceptionHttpService";

    static createException(input: IExceptionHttpService['input']) {

        throw new HttpException(ApiResponse.handler({
            codNumber: input.errorCode,
            property: input.property,
            valueArg: input.value,
            outputError: {
                message: input.objError.message,
                context: {
                    input: input,
                    output: {
                        className: "className",
                        methodName: "throw new HttpException(ApiResponse.handler)",
                        objectErro: input.objError.context.output.objError
                    }
                }
            }
        }), input.statusCode);
    }
}
