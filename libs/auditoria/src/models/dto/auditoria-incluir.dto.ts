export class AuditoriaIncluirInputDto implements AuditoriaIncluirInputType {
    codChave: number;
    codAcao: number;
    codInteressado: number;
    dtAcao: Date;
    codUsuario: number;
    txtSql: string;
    txtEnderecoIp: string;
    txtEnderecoNome: string;
    codOrigem: number;
    txtAlteracao: string;
}

export type AuditoriaIncluirInputType = IAuditoriaIncluirDto['input'];

export interface IAuditoriaIncluirDto {
    input: {
        codChave: number;
        codAcao: number;
        codInteressado: number;
        dtAcao: Date;
        codUsuario: number;
        txtSql: string;
        txtEnderecoIp: string;
        txtEnderecoNome: string;
        codOrigem: number;
        txtAlteracao: string;
    },
    output: null;
}
