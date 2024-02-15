import { Injectable } from "@nestjs/common";

import { IMessage } from "./code-messages";
import { GlobalService } from "./global.service";

@Injectable()
export class ApiResponse<Tin = any, Tout = any> {
    handler(input: IApiResponseMessage<Tin, Tout>): IApiResponseHandler<Tin, Tout> {
        let message = fnReplaceText(input);
        const msgType = (input.error) ? 'error' : 'warning';

        const data: Tout = input.output;
        const status: IStatusMessage<Tin, Tout> = {
            statusCode: input.objMessage.code,
            message: message,
            [msgType]: precaution(input)
        };

        return { data, status };

        function precaution(input: IApiResponseMessage<Tin, Tout>): IError<Tin, Tout> {
            const inputMsgType = (<IError<Tin,Tout>>input[msgType])
            return (!(GlobalService.debugModeVerify() && (input?.error?.message || input?.warning?.message)))
                ? undefined
                : {
                    message: inputMsgType?.message,
                    fix: inputMsgType?.fix,
                    context: {
                        className: inputMsgType?.context?.className,
                        methodName: inputMsgType?.context?.methodName,
                        input: inputMsgType?.context?.input,
                        output: inputMsgType.context?.output
                    }
                };
        }

        function fnReplaceText(input: IApiResponseMessage<Tin, Tout>) {
            let message = input.objMessage?.text;
            if (input.property)
                message = message?.replace("@campo", input.property);
            if (input.valueArg)
                message = message?.replace("@valor", input.valueArg);
            return message;
        }
    }
}

export interface IApiResponseHandler<Tin, Tout> {
    data: Tout;
    status: IStatusMessage<Tin, Tout>;
}

interface IStatusMessage<Tin, Tout> {
    statusCode: number;
    message: string;
    error?: IError<Tin, Tout>;
    warning?: IError<Tin, Tout>;
}

interface IError<Tin, Tout> {
    message: string;
    fix?: string;
    context?: {
        className?: string;
        methodName?: string;
        input?: Tin,
        output?: Tout;
    };
}

export interface IApiResponseMessage<Tin, Tout> {
    objMessage: IMessage,
    valueArg?: string,
    property?: string,
    input?: Tin,
    output?: Tout,
    error?: IError<Tin, Tout>;
    warning?: IError<Tin, Tout>;
}

