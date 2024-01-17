export class AuditoriaConsultarInputDto implements AuditoriaConsultarInputType {
    dtInicial: Date;
    dtFinal: Date;
    codUsuarioExterno: number;
    operacaoTipo: string;
}

type AuditoriaConsultarInputType = IAuditoriaConsultarDto['input'];

export interface IAuditoriaConsultarDto {
    input: {
        dtInicial: Date;
        dtFinal: Date;
        codUsuarioExterno: number;
        operacaoTipo: string;
    },
    output: {
        operacaoTipo: string;
        de: string;
        para: string;
    };
}
