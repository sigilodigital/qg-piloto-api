/**
 * codNumber (number) representa o codigo da mensagem
 * valueArg (string) é o valor passado na propriedade analisada
 * property (string) é o nome da proriedade analisada
 * objEntrada?: object|Array<any>, Objeto usado para especificar objeto de entrada para comparar resultado de saída
 * objSaida?: object|Array<any>,Caso a consulta seja retorne dados retornar o objeto de pesquisa
 * objSaidaErro?: object criar objeto com {acao: "ação necessária para mitigar resolução do erro"}
 */
import { MensagenEnum } from "./enum/mensagens.enum";

export default (input: IMensagem) => {
  const dados = {
    data: input.objSaida,
    status: {
      statusCode: input.codNumber,
      message: MensagenEnum[input.codNumber].replace("@campo", input.property),
      error: {
        valor: input.valueArg,
        entrada: input.objEntrada,
        saida: input.objSaidaErro
      }
    }

  }

  return JSON.stringify(dados);

};

interface IMensagem {
  codNumber: number,
  valueArg?: string,
  property?: string,
  objEntrada?: object | Array<any>,
  objSaida?: object | Array<any>,
  objSaidaErro?: object
}