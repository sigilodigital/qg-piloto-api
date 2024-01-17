export class AuditoriaConsultarInputDto implements AuditoriaConsultarInputType {
    dtInicial: Date;
    dtFinal: Date;
    codInteressado: number;
    operacaoTipo: string;
}

type AuditoriaConsultarInputType = IAuditoriaConsultarDto['input'];

export interface IAuditoriaConsultarDto {
    input: {
        dtInicial: Date;
        dtFinal: Date;
        codInteressado: number;
        operacaoTipo: string;
    },
    output: {
        operacaoTipo: string;
        de: string;
        para: string;
    };
}
