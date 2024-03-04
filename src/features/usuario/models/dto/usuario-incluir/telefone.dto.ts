import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Validate } from 'class-validator';

import { IConstraintSchema } from "@sd-root/libs/common/src/models/interfaces/ConstraintsSchema";
import { ValidaSchema } from "@sd-root/libs/common/src/validations/schema.validate";
import { TelefoneEntity } from "@sd-root/libs/common/src/models/entities/contato/telefone.entity";

export class TelefoneInputDto implements TelefoneEntity {

    @ApiProperty({ name: 'id', type: String, nullable: false, required: true, maxLength: 11 })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    id?: string;

    @ApiProperty({ name: 'number', type: String, nullable: false, required: true, maxLength: 15 })
    number: string;

    @ApiProperty({ name: 'description', type: String, nullable: true, maxLength: 255 })
    description?: string;
}

export class TelefoneOutputDto extends PartialType(TelefoneInputDto) { }
