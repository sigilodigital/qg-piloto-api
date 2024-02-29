import { ApiProperty } from "@nestjs/swagger";
import { Validate, ValidateNested } from 'class-validator';

import { IConstraintSchema } from "@sd-root/libs/common/src/models/interfaces/ConstraintsSchema";
import { ValidaSchema } from "@libs/common/validations/valida-schema";
import { EmailEntity } from "../../../../../../libs/common/src/models/entities/contato/email.entity";
import { ContatoEntity } from "../../../../../../libs/common/src/models/entities/contato/contato.entity";
import { TelefoneEntity } from "../../../../../../libs/common/src/models/entities/contato/telefone.entity";
import { EnderecoEntity } from "../../../../../../libs/common/src/models/entities/contato/endereco.entity";
import { EmailInputDto } from "./email.dto";
import { TelefoneInputDto } from "./telefone.dto";
import { EnderecoInputDto } from "./endereco.dto";
import { DataAccessEntity } from "../../entities/data-access.entity";
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
