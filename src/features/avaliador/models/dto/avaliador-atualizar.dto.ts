import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Validate } from 'class-validator';

import { IConstraintSchema } from '@sd-root/libs/common/src/models/interfaces/ConstraintsSchema';
import { ValidaSchema } from '@libs/common/validations/valida-schema';
import { AvaliadorIncluirInputDto, AvaliadorIncluirOutputDto } from './avaliador-incluir/avaliador-incluir.dto';

export class AvaliadorAtualizarInputDto extends PartialType(AvaliadorIncluirInputDto) {

    @ApiProperty({ name: 'id', type: String, nullable: false, required: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'string' }])
    id: string;
}

export class AvaliadorAtualizarOutputDto
// extends OmitType(AvaliadorIncluirOutputDto, []) 
{ }