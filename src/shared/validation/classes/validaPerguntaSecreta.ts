import { HttpStatus } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { AppDataSource } from 'src/database';
import { ExceptionHttpService } from 'src/exception-http/exception-http.service';
import { PerguntaSecreta } from 'src/recuperacao-senha/entities/pergunta-secreta.entity';
import { somenteNumeros } from 'src/shared/utils';


@ValidatorConstraint({ name: 'ValidaPerguntaSecreta', async: false })
export class ValidaPerguntaSecreta implements ValidatorConstraintInterface {
    private codMessage: number;
    className = "ValidaPerguntaSecreta";

    async validate(text: string, args: ValidationArguments) {
        if (text == undefined) {
            return true;
        } else {
            if (text.length > 4) {
                this.codMessage = 2;
                return false;
            }

            if (await somenteNumeros(text)) {
                const perguntaSecreta = await AppDataSource.manager.findOne(PerguntaSecreta, { where: { codPerguntaSecreta: args.object['codPerguntaSecreta'] } });
                if (perguntaSecreta) {
                    return true;
                } else {
                    this.codMessage = 32;
                    return false;
                }
            } else {
                this.codMessage = 3;
            }
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


