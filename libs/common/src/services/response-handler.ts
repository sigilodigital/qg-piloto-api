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
        let mensagem = MensagenEnum[input.codNumber];
        if (input.property)
            mensagem = mensagem?.replace("@campo", input.property);
        if (input.valueArg)
            mensagem = mensagem?.replace("@valor", input.valueArg);

        return {
            data: input.output,
            status: {
                statusCode: input.codNumber,
                message: mensagem,
                ...(!(GlobalService.debugModeVerify() && input?.outputError?.message)) ? undefined : {
                    error: {
                        message: input?.outputError?.message,
                        context: {
                            input: input?.outputError?.context?.input,
                            output: {
                                className: input?.outputError?.context?.output?.className,
                                methodName: input?.outputError?.context?.output?.methodName,
                                objectErro: input?.outputError?.context?.output?.objectErro
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
        input?: IMensagem['input'],
        output?: {
            className?: string;
            methodName?: string;
            objectErro?: object;
        };
    };
}

interface IMensagem {
    codNumber: number,
    valueArg?: string,
    property?: string,
    input?: object | Array<any>,
    output?: object | Array<any>,
    outputError?: IObjError;
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
