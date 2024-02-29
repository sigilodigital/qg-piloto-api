import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Validate } from 'class-validator';

import { IConstraintSchema } from "@sd-root/libs/common/src/models/interfaces/ConstraintsSchema";
import { ValidaSchema } from "@libs/common/validations/valida-schema";
import { ContatoEntity } from "../../../../../../libs/common/src/models/entities/contato/contato.entity";
import { EnderecoEntity } from "../../../../../../libs/common/src/models/entities/contato/endereco.entity";
import { ContatoInputDto } from "./contato.dto";

export class EnderecoInputDto implements EnderecoEntity {

    @ApiProperty({ name: 'id', type: String, nullable: false, required: true, maxLength: 11 })
    @Validate(ValidaSchema, [<IConstraintSchema>{}])
    id?: string;

    place: string;

    number: string;

    description: string;
    
    _contato?: ContatoInputDto;

}

export class EnderecoOutputDto extends PartialType(EnderecoInputDto) { }
