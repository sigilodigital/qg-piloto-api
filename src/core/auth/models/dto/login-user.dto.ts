import { ApiProperty } from "@nestjs/swagger";
import { ValidaSchema } from "@sd-root/libs/common/src/validations/schema.validate";
import { IConstraintSchema } from "@sd-root/src/shared/interfaces/ConstraintsSchema";
import { Validate } from "class-validator";

export class LoginUserInputDto {

    @ApiProperty({ name: 'username', type: String })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'string', nullable: false, maxLength: 50, regex: /[^~]/ }])
    username: string;

    @ApiProperty({ name: 'password', type: String })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'string', nullable: false, maxLength: 50, regex: /[^~]/ }])
    password: string;

}
export class LoginUserOutputDto {

    id: string;
    fullname: string;
    socialname: string;
    cpf: number;
    __params: {
        isPasswordRequireChange: boolean;
    };
    token?: {
        bearer: string;
        replace: string;
    };

}