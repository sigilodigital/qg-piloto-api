import { HttpStatus } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ExceptionHttpService } from 'src/exception-http/exception-http.service';
import { Schemas } from 'src/shared/schemas/schemas';


@ValidatorConstraint({ name: 'ValidaCampoPorSchema', async: true })
export class ValidaCampoPorSchema implements ValidatorConstraintInterface {
    private codMessage: number;
    className = "ValidaCampoPorSchema";

    async validate(value: string, args: ValidationArguments) {
        return this.validaCampoSchema(value, args);
    }

    async validaCampoSchema(value: string, args: ValidationArguments) {

        const schema = (await Schemas.schemaList(args.targetName)).schema;
        const property = schema.options.columns[args.property];
        const primitivoList = ['string', 'number', 'boolean', 'null', 'undefined'];

        // primitivo
        if (!primitivoList.includes(<string>property.type)) {
            return false;
        }

        // nulo
        if (!value && !property.nullable) {
            this.codMessage = 1;
            return false;
        }

        // nulo e aceita null não deve ser validado.
        if (!value && property.nullable) {
            return true;
        }

        // tipo
        if (property.type != typeof value) {
            this.codMessage = 3;
            return false;
        }

        // tamanho
        if (value && property.type === 'number') {
            value = value.toString();
        }
        if (value.length > <number>property.length) {
            this.codMessage = 2;
            return false;
        }

        // valor padrao
        if (property.default && !(property.default)?.includes(+value)) {
            this.codMessage = 4;
            return false;
        }

        return true;

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