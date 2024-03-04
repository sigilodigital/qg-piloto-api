import { ApiProperty } from "@nestjs/swagger";
import { Validate, ValidateNested } from 'class-validator';

import { IConstraintSchema } from "@sd-root/libs/common/src/models/interfaces/ConstraintsSchema";
import { ValidaSchema } from "@sd-root/libs/common/src/validations/schema.validate";
import { ContatoInputDto } from "@sd-root/libs/common/src/models/dto/contato/contato.dto";
import { UsuarioIncluirInputDto } from "@sd-root/src/features/usuario/models/dto/usuario-incluir/usuario-incluir.dto";
import { AvaliadorDocumentacaoEntity } from "../../entities/avaliador-documentacao.entity";
import { AvaliadorEntity } from "../../entities/avaliador.entity";

export class AvaliadorIncluirInputDto implements AvaliadorEntity {

    @ApiProperty({ name: 'nacionalidade', type: String, nullable: true, required: false })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'string', nullable: true }])
    nacionalidade?: string;

    @ApiProperty({ name: 'naturalidade', type: String, nullable: true, required: false })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'string', nullable: true }])
    naturalidade?: string;

    @ApiProperty({ name: 'nomeMae', type: String, nullable: true, required: false })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'string', nullable: true }])
    nomeMae?: string;

    @ApiProperty({ name: 'nomePai', type: String, nullable: true, required: false })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'string', nullable: true }])
    nomePai?: string;

    @ApiProperty({ name: 'instituicaoNome', type: String, nullable: true, required: false })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'string', nullable: true }])
    instituicaoNome?: string;

    @ApiProperty({ name: '_instituicaoContato', type: ContatoInputDto })
    @ValidateNested()
    _instituicaoContato?: ContatoInputDto;

    @ApiProperty({ name: '_documentacao', type: AvaliadorDocumentacaoEntity })
    @ValidateNested()
    _documentacao?: AvaliadorDocumentacaoEntity;

    @ApiProperty({ name: '_usuario', type: UsuarioIncluirInputDto })
    @ValidateNested()
    _usuario: UsuarioIncluirInputDto;

    @ApiProperty({ name: 'isActive', type: Boolean, nullable: true, required: false, default: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'boolean', nullable: true }])
    isActive?: boolean;

}

export class AvaliadorIncluirOutputDto
// extends OmitType(AvaliadorIncluirInputDto, []) 
{ }