import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { IConstraintSchema } from '../interfaces/ConstraintsSchema';

@ValidatorConstraint({ name: 'ValidaCampoObrigatorio', async: true })
export class ValidaCampoObrigatorio implements ValidatorConstraintInterface {

    private codMessage: number;
    className = "ValidaCampoObrigatorio";

    async validate(value: string, args: ValidationArguments) {
        const schema = <IConstraintSchema>args.constraints[0];

        if (!value && !schema.nullable) {
            args.constraints.push(3);
            return false;
        }

        return true;

    }

    defaultMessage(args?: ValidationArguments): string {
        const objError = {
            codMessage: args.constraints[1]
        }

        return JSON.stringify(objError);
    }

    // message(codeMessage: number, args: ValidationArguments) {
    //     throw new HttpException(
    //         JSON.parse(responseHandler(this.codMessage, null, args.property)),
    //         HttpStatus.BAD_REQUEST
    //     );
    // }

}