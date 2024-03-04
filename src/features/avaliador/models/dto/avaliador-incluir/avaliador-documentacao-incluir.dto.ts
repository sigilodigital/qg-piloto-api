import { ApiProperty } from "@nestjs/swagger";
import { Validate, ValidateNested } from 'class-validator';

import { IConstraintSchema } from "@sd-root/libs/common/src/models/interfaces/ConstraintsSchema";
import { ValidaSchema } from "@sd-root/libs/common/src/validations/schema.validate";
import { AvaliadorDocumentacaoEntity } from "../../entities/avaliador-documentacao.entity";
import { AvaliadorEntity } from "../../entities/avaliador.entity";

export class AvaliadorDocumentacaoIncluirInputDto implements AvaliadorDocumentacaoEntity {

    @ApiProperty({ name: 'urlCurriculum', type: String, nullable: true, required: false })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'string', nullable: true }])
    urlCurriculum?: string;

    @ApiProperty({ name: 'identNumero', type: String, nullable: false, required: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'string', nullable: false }])
    identNumero: string;

    @ApiProperty({ name: 'identDtExpedicao', type: Date, nullable: false, required: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'Date', nullable: false }])
    identDtExpedicao: Date;

    @ApiProperty({ name: 'identOrgaoExpedidor', type: String, nullable: false, required: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'string', nullable: false }])
    identOrgaoExpedidor: string;

    @ApiProperty({ name: 'nit_pis_pasep', type: String, nullable: false, required: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'string', nullable: false }])
    nit_pis_pasep: string;

    @ApiProperty({ name: 'bancoNome', type: String, nullable: false, required: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'string', nullable: false }])
    bancoNome: string;

    @ApiProperty({ name: 'bancoAgencia', type: String, nullable: false, required: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'string', nullable: false }])
    bancoAgencia: string;

    @ApiProperty({ name: 'bancoContaNumero', type: String, nullable: false, required: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'string', nullable: false }])
    bancoContaNumero: string;

    @ApiProperty({ name: 'bancoContaDigito', type: String, nullable: false, required: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'string', nullable: false }])
    bancoContaDigito: string;

    @ApiProperty({ name: 'seExpCoordCursoES', type: Boolean, nullable: false, required: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'boolean', nullable: false }])
    seExpCoordCursoES: boolean;

    @ApiProperty({ name: 'seExpAvalES', type: Boolean, nullable: false, required: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'boolean', nullable: false }])
    seExpAvalES: boolean;

    @ApiProperty({ name: 'seExpDocenciaES', type: Boolean, nullable: false, required: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'boolean', nullable: false }])
    seExpDocenciaES: boolean;

    @ApiProperty({ name: 'seExpEADTutDoc', type: Boolean, nullable: false, required: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'boolean', nullable: false }])
    seExpEADTutDoc: boolean;

    @ApiProperty({ name: '_avaliador', type: Boolean, nullable: false, required: true })
    @ValidateNested()
    _avaliador?: AvaliadorEntity;

    @ApiProperty({ name: 'isActive', type: Boolean, nullable: true, required: false, default: true })
    @Validate(ValidaSchema, [<IConstraintSchema>{ type: 'boolean', nullable: true }])
    isActive?: boolean;

}

export class AvaliadorIncluirOutputDto
// extends OmitType(AvaliadorIncluirInputDto, []) 
{ }