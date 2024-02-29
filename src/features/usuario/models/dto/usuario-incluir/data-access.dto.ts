import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Validate, ValidateNested } from 'class-validator';

import { IConstraintSchema } from "@sd-root/libs/common/src/models/interfaces/ConstraintsSchema";
import { ValidaSchema } from "@libs/common/validations/valida-schema";
import { EmailEntity } from "../../entities/email.entity";
import { ContatoEntity } from "../../entities/contato.entity";
import { TelefoneEntity } from "../../entities/telefone.entity";
import { EnderecoEntity } from "../../entities/endereco.entity";
import { EmailInputDto } from "./email.dto";
import { TelefoneInputDto } from "./telefone.dto";
import { EnderecoInputDto } from "./endereco.dto";
import { DataAccessEntity } from "../../entities/data-access.entity";
import { ProfileInputDto } from "./profile.dto";

// TODO: concluir: add propriedades
// TODO: adicionar validadores
export class DataAccessInputDto implements DataAccessEntity {

    @ApiProperty({ name: 'id', type: String, nullable: false })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    id?: string;

    @ApiProperty({ name: 'username', type: String, nullable: false })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    username: string;

    @ApiProperty({ name: 'username', type: String, nullable: false })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    password?: string;

    passCountErrors?: number;
    isPasswordLocked?: boolean;
    isPasswordRequireChange?: boolean;

    @ApiProperty({ name: '_profileList', type: ProfileInputDto, isArray: true, nullable: true })
    @ValidateNested({ each: true })
    _profileList?: ProfileInputDto[];
}

export class DataAccessOutputDto extends PartialType(DataAccessInputDto) {

}
