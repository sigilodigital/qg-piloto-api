import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { IConstraintSchema } from '../interfaces/ConstraintsSchema';

@ValidatorConstraint({ name: 'ValidaCampoTipo',async:true})
export class ValidaCampoTipo implements ValidatorConstraintInterface {

    async validate(value: string, args: ValidationArguments) {
        const schema = <IConstraintSchema>args.constraints[0];

        if (!value) return true;

        if (typeof value !== schema.type) return false;

        return true;
    }

    //   defaultMessage(args: ValidationArguments) {
    //     // here you can provide default error message if validation failed
    //     return `Text (${args}) is too short or too long!`;
    //   }
}