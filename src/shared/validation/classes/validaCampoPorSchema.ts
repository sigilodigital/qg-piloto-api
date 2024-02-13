import { HttpStatus } from '@nestjs/common';
import { IMessage, MSG } from '@libs/common/services/code-messages';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ExceptionHttpService } from 'src/exception-http/exception-http.service';
import { Schemas } from 'src/shared/schemas/schemas';


@ValidatorConstraint({ name: 'ValidaCampoPorSchema', async: true })
export class ValidaCampoPorSchema implements ValidatorConstraintInterface {
    private LOG_CLASS_NAME = "ValidaCampoPorSchema";

    private objMessage: IMessage;

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
            this.objMessage = MSG.ERR_FIELD_N_INFO;
            return false;
        }

        // nulo e aceita null não deve ser validado.
        if (!value && property.nullable) {
            return true;
        }

        // tipo
        if (property.type != typeof value) {
            this.objMessage = MSG.ERR_FIELD_TIPO;
            return false;
        }

        // tamanho
        if (value && property.type === 'number') {
            value = value.toString();
        }
        if (value.length > <number>property.length) {
            this.objMessage = MSG.ERR_FIELD_TAM;
            return false;
        }

        // valor padrao
        if (property.default && !(property.default)?.includes(+value)) {
            this.objMessage = MSG.ERR_FIELD_VALOR;
            return false;
        }

        return true;

    }

    defaultMessage(args: ValidationArguments) {
        ExceptionHttpService.createException({
            property: args.property,
            valueArg: args.value,
            httpStatusCode: HttpStatus.BAD_REQUEST,
            objMessage: this.objMessage,
            errMessage: '',
            error: {
                message: "Erro na validação básica dos campos",
                context: {
                    className: this.LOG_CLASS_NAME,
                    methodName: this.defaultMessage.name,
                    input: args,
                    output: null
                }
            }
        });

        return ``;
    }

}