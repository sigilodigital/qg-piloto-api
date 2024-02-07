import { Injectable } from "@nestjs/common";

import { MensagenEnum } from "../enumerations/mensagens.enum";
import { GlobalService } from "./global.service";

@Injectable()
export class ApiResponse<Tin,Tout> {
    handler(input: IMensagem<Tin,Tout>): IAPIResponse<Tin, Tout> {
        let mensagem = MensagenEnum[input.codMessage];
        if (input.property)
            mensagem = mensagem?.replace("@campo", input.property);
        if (input.valueArg)
            mensagem = mensagem?.replace("@valor", input.valueArg);

        return {
            data: input.output,
            status: {
                statusCode: input.codMessage,
                message: mensagem,
                ...(!(GlobalService.debugModeVerify() && input?.error?.message)) ? undefined : {
                    error: <IError<Tin, Tout>>{
                        message: input?.error?.message,
                        context: {
                            className: input?.error?.context?.className,
                            methodName: input?.error?.context?.methodName,
                            input: input?.input,
                            output: input.output
                        }
                    }
                }
            }
        };
    }
}

export interface IAPIResponse<Tin, Tout> {
    data: Tout;
    status: IStatusMessage<Tin, Tout>;
}

interface IStatusMessage<Tin, Tout> {
    statusCode: number;
    message: string;
    error?: IError<Tin, Tout>;
}

interface IError<Tin,Tout> {
    message: string;
    context?: {
        className?: string;
        methodName?: string;
        input?: Tin,
        output?: Tout
    };
}

interface IMensagem<Tin, Tout> {
    codMessage: number,
    valueArg?: string,
    property?: string,
    input?: Tin,
    output?: Tout,
    error?: IError<Tin, Tout>;
}

