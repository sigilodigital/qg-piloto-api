import { HttpStatus } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ExceptionHttpService } from 'src/exception-http/exception-http.service';

@ValidatorConstraint({ name: 'ValidaTamanhoCnpjCpf', async: true })
export class ValidaTamanhoCnpjCpf implements ValidatorConstraintInterface {
    private codMessage: number;
    className = "ValidaTamanhoCnpjCpf";

    async validate(text: string, args: ValidationArguments): Promise<boolean> {
        if (text) {
            const tamanho = text.toString().length;
            if ((tamanho != 11) && (tamanho != 14)) {
                this.codMessage = 2
                return false
            } else return true;
        } else {
            return true;
        }
    }

    defaultMessage(args: ValidationArguments) {
        const methodName = "defaultMessage(args: ValidationArguments)";
        ExceptionHttpService.createException({
            property: args.property,
            value: args.value,
            statusCode: HttpStatus.BAD_REQUEST,
            errorCode: this.codMessage,
            objError: {
                message: "Validação de campos",
                context: {
                    input: args,
                    output: {
                        className: this.className,
                        methodName: methodName
                    }
                }
            }
        });

        return ``;
    }
}