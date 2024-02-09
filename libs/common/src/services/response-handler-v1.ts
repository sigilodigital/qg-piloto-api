/**
 * codNumber (number) representa o codigo da mensagem
 * valueArg (string) é o valor passado na propriedade analisada
 * property (string) é o nome da proriedade analisada
 * input?: object|Array<any>, Objeto usado para especificar objeto de entrada para comparar resultado de saída
 * output?: object|Array<any>,Caso a consulta seja retorne dados retornar o objeto de pesquisa
 * outputError?: object criar objeto com {acao: "ação necessária para mitigar resolução do erro"}
 */

import { MensagenEnum } from "../enumerations/mensagens.enum";
import { GlobalService } from "./global.service";

export class ApiResponse {
    static handler(input: IMensagem): IAPIResponse<any> {
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
                    error: {
                        message: input?.error?.message,
                        context: {
                            input: input?.error?.context?.input,
                            output: {
                                className: input?.error?.context?.output?.className,
                                methodName: input?.error?.context?.output?.methodName,
                                objectErro: input?.error?.context?.output?.objectError
                            }
                        }
                    }
                }
            }
        };
    }
}

interface IObjError {
    message: string;
    context?: {
        className?: string;
        methodName?: string;
        input?: IMensagem['input'],
        output?: {
            className?: string;
            methodName?: string;
            objectError?: object;
        };
    };
}

interface IMensagem {
    codMessage: number,
    valueArg?: string,
    property?: string,
    input?: object | Array<any>,
    output?: object | Array<any>,
    error?: IObjError;
}

interface IStatusMessage {
    statusCode: number;
    message: string;
    error?: any;
}

export interface IAPIResponse<T> {
    data: T;
    status: IStatusMessage;
}
