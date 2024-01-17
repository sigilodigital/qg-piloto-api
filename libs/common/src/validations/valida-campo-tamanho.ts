import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { IConstraintSchema } from '../interfaces/ConstraintsSchema';


@ValidatorConstraint({ name: 'ValidaCampoTamanho', async: true })
export class ValidaCampoTamanho implements ValidatorConstraintInterface {
    private codeMessage: number;

    async validate(value: string, args: ValidationArguments) {
        const schema = <IConstraintSchema>args.constraints[0];

        if (!value) return true;

        if (schema.type === 'number')
            value = value.toString();

        if (value.length < schema.minLength) 
        return this.minLength(value, schema);

        if (value.length > schema.maxLength) 
        return this.maxLength(value, schema);

        return true;
    }

    minLength(value:string, schema: IConstraintSchema){
        return value.length < schema.minLength
    }
    
    maxLength(value:string, schema:IConstraintSchema){
        return value.length > schema.maxLength
    }

    orLength(value: string, lengthList:number[]){
        return lengthList.includes(value.length)
    }

    // defaultMessage(args: ValidationArguments) {
    //     ExceptionHttpService.createException({
    //         property: args.property,
    //         value: args.value,
    //         statusCode: HttpStatus.BAD_REQUEST,
    //         errorCode: this.codeMessage,
    //         objError: args
    //     });
    //     return ``;
    // }
}


