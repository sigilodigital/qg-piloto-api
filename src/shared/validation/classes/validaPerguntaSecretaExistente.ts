import { HttpStatus } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ExceptionHttpService } from 'src/exception-http/exception-http.service';
import { somenteNumeros } from 'src/shared/utils';
import { AppDataSource } from '../../../database/index';

@ValidatorConstraint({ name: 'ValidaPerguntaSecretaExistente', async: true })
export class ValidaPerguntaSecretaExistente implements ValidatorConstraintInterface {

    private codMessage: number;
    className = "ValidaPerguntaSecretaExistente";

    async validate(value: string, args: ValidationArguments) {
        if (value) {
            if (!(await somenteNumeros(value))) {
                this.codMessage = 3;
                return false;
            }
            const perguntaSecreta = await AppDataSource.manager.query(`
                SELECT *
                FROM IUSR_PROTON.TBL_PERGUNTA_SECRETA
                WHERE COD_PERGUNTA_SECRETA = ${value}
            `);
            if (perguntaSecreta.length > 0) {
                return true;
            } else {
                this.codMessage = 32;
                return false;
            }
        } else return true;
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