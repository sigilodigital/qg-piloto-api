import { ApiProperty } from "@nestjs/swagger";

export class LoginUserInputDto {

    @ApiProperty({ name: 'username', type: String })
    // @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'string', orLength: [11, 14] }])
    username: string;

    @ApiProperty({ name: 'password', type: String })
    // @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'string', orLength: [11, 14] }])
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