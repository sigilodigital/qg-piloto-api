import { HttpStatus } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ExceptionHttpService } from 'src/exception-http/exception-http.service';
import { validaCNPJ, validaCPF } from './cpf_cnpj.validation';

@ValidatorConstraint({ name: 'ValidaCnpjCpf', async: true })
export class ValidaCnpjCpf implements ValidatorConstraintInterface {

    private codMessage: number;
    private property: string;
    private value: any;
    className = "ValidaCnpjCpf";

    async validate(value: string, args: ValidationArguments) {
        return this.validaCnpjCpf(value, args);
    }

    async validaCnpjCpf(value: string, args: ValidationArguments) {
        const onlyNumbers = new RegExp('^[0-9]+$')
        this.codMessage = 36;
        value = value.toString()
        if (!onlyNumbers.test(value)) {
            this.codMessage = 3;
            this.property = args.property;
            this.value = args.value;
            return false
        }

        if (value?.toString()?.length === 11) if (validaCPF(value)) return true;
        else {
            this.property = 'CPF';
            this.value = args.value;
            return false;
        }
        if (value?.toString()?.length === 14) if (validaCNPJ(value)) return true;
        else {
            this.property = 'CNPJ';
            this.value = args.value;
            return false;
        }

        this.property = args.property;
        this.codMessage = 2;
        this.value = args.value;
        return false;
    }

    defaultMessage(args: ValidationArguments) {
        const methodName = "defaultMessage(args: ValidationArguments)";
        ExceptionHttpService.createException({
            property: this.property,
            valueArg: this.value,
            httpStatusCode: HttpStatus.BAD_REQUEST,
            errMessage: '',
            objMessage: {code: 1,text:''},
            error: {
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