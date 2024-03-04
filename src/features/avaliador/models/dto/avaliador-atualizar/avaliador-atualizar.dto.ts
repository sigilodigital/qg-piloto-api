import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Validate } from 'class-validator';

import { IConstraintSchema } from '@sd-root/libs/common/src/models/interfaces/ConstraintsSchema';
import { ValidaSchema } from '@sd-root/libs/common/src/validations/schema.validate';
import { AvaliadorIncluirInputDto } from '../avaliador-incluir/avaliador-incluir.dto';

export class AvaliadorAtualizarInputDto extends PartialType(AvaliadorIncluirInputDto) {

    @ApiProperty({ name: 'id', type: String, nullable: false, required: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'string' }])
    id: string;

}

export class AvaliadorAtualizarOutputDto
// extends OmitType(AvaliadorIncluirOutputDto, []) 
{ }