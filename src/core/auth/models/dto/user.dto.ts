import { ApiProperty } from "@nestjs/swagger";
import { Validate } from "class-validator";
import { ValidaCampoPorSchema } from '@sd-root/libs/common/src/validations/v1/validaCampoPorSchema';
import { ValidaCnpjCpf } from "@sd-root/libs/common/src/validations/v1/validaCnpjCpf";
// import { ValidaTamanhoCnpjCpf } from 'src/shared/validation/classes/validaTamanhoCnpjCpf';
import { Column } from "typeorm";

export class UserDto {
    @ApiProperty({
        description: 'txtCnpjCpf',
        type: String
    })
    @Validate(ValidaCnpjCpf)
    // @Validate(ValidaTamanhoCnpjCpf)
    @Validate(ValidaCampoPorSchema)
    @Column("varchar", {
        name: "TXT_CNPJ_CPF",
        nullable: true,
        unique: true,
        length: 14,
    })
    txtCnpjCpf: string | null;

    @ApiProperty({
        name: 'txtSenha',
        type: String,
        required: true
    })
    @Validate(ValidaCampoPorSchema)
    @Column("varchar", { name: "TXT_SENHA", nullable: true, length: 300 })
    txtSenha: string | null;
}