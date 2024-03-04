import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Validate } from 'class-validator';

import { EmailEntity } from "@sd-root/libs/common/src/models/entities/contato/email.entity";
import { IConstraintSchema } from "@sd-root/libs/common/src/models/interfaces/ConstraintsSchema";
import { ValidaSchema } from "@sd-root/libs/common/src/validations/schema.validate";

export class EmailInputDto implements EmailEntity {

    @ApiProperty({ name: 'id', type: String, nullable: false, required: true, maxLength: 11 })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    id?: string;

    @ApiProperty({ name: 'address', type: String, nullable: false, required: true, maxLength: 11 })
    address: string;
    
    description?: string;
}

export class EmailOutputDto extends PartialType(EmailInputDto) { }
