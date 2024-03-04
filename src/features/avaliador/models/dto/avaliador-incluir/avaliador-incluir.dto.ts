import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Validate, ValidateNested } from 'class-validator';

import { ValidaSchema } from "@libs/common/validations/valida-schema";
import { ContatoEntity } from "@sd-root/libs/common/src/models/entities/contato/contato.entity";
import { IConstraintSchema } from "@sd-root/libs/common/src/models/interfaces/ConstraintsSchema";
import { UsuarioIncluirInputDto } from "@sd-root/src/features/usuario/models/dto/usuario-incluir/usuario-incluir.dto";
import { UsuarioEntity } from "@sd-root/src/features/usuario/models/entities/usuario.entity";
import { AvaliadorEntity } from "../../entities/avaliador.entity";
import { ContatoInputDto } from "@sd-root/src/features/usuario/models/dto/usuario-incluir/contato.dto";
import { AvaliadorDocumentacaoEntity } from "../../entities/avaliador-documentacao.entity";

// TODO: concluir: add propriedades
// TODO: adicionar validadores
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