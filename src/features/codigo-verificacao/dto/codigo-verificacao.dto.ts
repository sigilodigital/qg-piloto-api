
export interface ICreateCodigoVerificacaoDto {
  input: {
    codCodigoVerificacaoPessoa: number;
    txtCodigoSeguranca: string;
    txtCnpjCpf: string;
  };
  output: {
    txtCodigoSeguranca: string;
    txtCnpjCpf: string;
    dtExpiracao: string;
  };
}
