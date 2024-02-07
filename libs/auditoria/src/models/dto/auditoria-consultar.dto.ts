export class AuditoriaConsultarInputDto implements AuditoriaConsultarInputType {
    dtInicial: Date;
    dtFinal: Date;
    usuarioId: string;
    operacaoTipo: string;
}

type AuditoriaConsultarInputType = IAuditoriaConsultarDto['input'];

export interface IAuditoriaConsultarDto {
    input: {
        dtInicial: Date;
        dtFinal: Date;
        usuarioId: string;
        operacaoTipo: string;
    },
    output: {
        operacaoTipo: string;
        de: string;
        para: string;
    };
}
