import { ApiProperty } from "@nestjs/swagger";
import { Validate } from "class-validator";

import { IConstraintSchema } from "@libs/common/interfaces/ConstraintsSchema";
import { ValidaSchema } from "src/shared/validation/classes/valida-schema";
import { ValidaCampoPorSchema } from 'src/shared/validation/classes/validaCampoPorSchema';
import { ValidaCnpjCpf } from 'src/shared/validation/classes/validaCnpjCpf';

export class LoginUserInputDto {

    @ApiProperty({ name: 'username', type: String })
    @Validate(ValidaCnpjCpf)
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'string', orLength: [11, 14] }])
    username: string;

    @ApiProperty({ name: 'password', type: String })
    @Validate(ValidaCampoPorSchema)
    password: string;

}
export class LoginUserOutputDto {

    id: string;
    fullname: string;
    socialname: string;
    cpf: number;
    __params: {
        isPasswordRequireChange: boolean;
    }
    token?: {
        bearer: string;
        replace: string;
    }

}