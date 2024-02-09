import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { IConstraintSchema } from '@libs/common/interfaces/ConstraintsSchema';
import { ApiResponse } from '@libs/common/services/response-handler-v2';
import { IMessage, MSG } from '@sd-root/libs/common/src/services/code-messages';

@ValidatorConstraint({ name: 'ValidaSchema', async: true })
export class ValidaSchema implements ValidatorConstraintInterface {
    LOG_CLASS_NAME = "ValidaSchema";

    constructor(private apiResponse: ApiResponse<any,any>){}

    async validate(value: string, args: ValidationArguments) {
        const schema = <IConstraintSchema>args.constraints[0];

        if (!value && schema.nullable)
            return true;

        this.validaNulo(value, schema, args);

        this.validaTipo(value, schema, args);

        this.validaTamanho(value, schema, args);

        this.validaValorPadrao(value, schema, args);

        this.validaExpressaoRegular(value, schema, args);

        return true;

    }

    validaNulo(value, schema: IConstraintSchema, args: ValidationArguments) {
        if ((!value) && !schema.nullable)
            this.message(MSG.ERR_FIELD_N_INFO, args);
    }

    validaTipo(value, schema: IConstraintSchema, args: ValidationArguments) {
        if (schema.type && schema.type !== typeof value)
            this.message(MSG.ERR_FIELD_TIPO, args);
    }

    validaTamanho(value: string, schema: IConstraintSchema, args: ValidationArguments) {

        if (minLength(value, schema) || maxLength(value, schema) || orLength(value, schema))
            this.message(MSG.ERR_FIELD_TAM, args);

        function minLength(value: string, schema: IConstraintSchema) {
            const r = (schema.minLength) ? value.toString().length < schema.minLength : false;
            return r;
        }

        function maxLength(value: string, schema: IConstraintSchema) {
            const r = (schema.maxLength) ? value.toString().length > schema.maxLength : false;
            return r;
        }

        function orLength(value: string, schema: IConstraintSchema) {
            const r = (schema.orLength) ? !(schema.orLength.includes(value.toString().length)) : false;
            return r;
        }
    }

    validaValorPadrao(value: string, schema: IConstraintSchema, args: ValidationArguments) {
        if (schema.default && !(<Array<any>>schema.default)?.includes(value))
            this.message(MSG.ERR_FIELD_VALOR, args);
    }

    validaExpressaoRegular(value: string, schema: IConstraintSchema, args: ValidationArguments) {
        if (schema.regex && !schema.regex.test(value))
            this.message(MSG.ERR_FIELD_VALOR, args);
    }

    message(objMessage: IMessage, args: ValidationArguments) {
        const objError = this.apiResponse.handler({
            objMessage: objMessage,
            property: args.property,
            valueArg: args.value,
            error: {
                message: `Validação do objeto ${args.targetName}:: ${args.property}: ${args.value}`,
                context: {
                    className: this.LOG_CLASS_NAME,
                    methodName: "defaultMessage(args: ValidationArguments)",
                    input: args,
                    output: null
                }
            }
        });

        throw new HttpException(objError, HttpStatus.BAD_REQUEST);
    }

}