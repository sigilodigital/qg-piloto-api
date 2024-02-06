import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { IConstraintSchema } from '../interfaces/ConstraintsSchema';
import { ApiResponse } from '../services/response-handler';

@ValidatorConstraint({ name: 'ValidaSchema', async: true })
export class ValidaSchema implements ValidatorConstraintInterface {
    className = "ValidaSchema";

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
            this.message(1, args);
    }

    validaTipo(value, schema: IConstraintSchema, args: ValidationArguments) {
        if (schema.type && schema.type !== typeof value)
            this.message(3, args);
    }

    validaTamanho(value: string, schema: IConstraintSchema, args: ValidationArguments) {

        if (minLength(value, schema) || maxLength(value, schema) || orLength(value, schema))
            this.message(2, args);

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
            this.message(4, args);
    }

    validaExpressaoRegular(value: string, schema: IConstraintSchema, args: ValidationArguments) {
        if (schema.regex && !schema.regex.test(value))
            this.message(4, args);
    }

    message(codMessage: number, args: ValidationArguments) {
        const objError = ApiResponse.handler({
            codMessage: codMessage,
            property: args.property,
            valueArg: args.value,
            error: {
                message: `Validação do objeto ${args.targetName} campo ${args.property} valor ${args.value}.`,
                context: {
                    input: args,
                    output: {
                        className: this.className,
                        methodName: "defaultMessage(args: ValidationArguments)"
                    }
                }
            }
        });

        throw new BadRequestException(objError);
    }

}