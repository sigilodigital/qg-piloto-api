import { Injectable } from "@nestjs/common";

import { MensagenEnum } from "../enumerations/mensagens.enum";
import { GlobalService } from "./global.service";
import { IMessage } from "./code-messages";

@Injectable()
export class ApiResponse<Tin, Tout> {
    handler(input: IApiResponseMessage<Tin, Tout>): IAPIResponseHandler<Tin, Tout> {
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
            return (!(GlobalService.debugModeVerify() && (input?.error?.message || input?.warning?.message)))
                ? undefined
                : {
                    message: input[msgType]?.message,
                    context: {
                        className: input[msgType]?.context?.className,
                        methodName: input[msgType]?.context?.methodName,
                        input: input?.input,
                        output: input.output
                    }
                };
        }

        function fnReplaceText(input: IApiResponseMessage<Tin, Tout>) {
            let message = input.objMessage.text;
            if (input.property)
                message = message?.replace("@campo", input.property);
            if (input.valueArg)
                message = message?.replace("@valor", input.valueArg);
            return message;
        }
    }
}

export interface IAPIResponseHandler<Tin, Tout> {
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
    context?: {
        className?: string;
        methodName?: string;
        input?: Tin,
        output?: Tout;
    };
}

interface IApiResponseMessage<Tin, Tout> {
    objMessage: IMessage,
    valueArg?: string,
    property?: string,
    input?: Tin,
    output?: Tout,
    error?: IError<Tin, Tout>;
    warning?: IError<Tin, Tout>;
}

