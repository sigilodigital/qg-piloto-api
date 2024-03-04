import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Validate, ValidateNested } from 'class-validator';

import { IConstraintSchema } from "@sd-root/libs/common/src/models/interfaces/ConstraintsSchema";
import { ValidaSchema } from "@sd-root/libs/common/src/validations/schema.validate";
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
