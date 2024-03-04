import { ApiProperty } from "@nestjs/swagger";
import { Validate } from 'class-validator';

import { IConstraintSchema } from "@sd-root/libs/common/src/models/interfaces/ConstraintsSchema";
import { ValidaSchema } from "@sd-root/libs/common/src/validations/schema.validate";
import { ProfileEntity } from "../../entities/profile.entity";

// TODO: concluir: add propriedades
// TODO: adicionar validadores
export class ProfileInputDto implements ProfileEntity {

    @ApiProperty({ name: 'id', type: String, nullable: false })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    id?: string;

    @ApiProperty({ name: 'name', type: String, nullable: false })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    name: string;
}

export class ProfileOutputDto {

}
