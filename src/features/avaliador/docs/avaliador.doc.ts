import { ApiOperationOptions } from "@nestjs/swagger";

interface IDoc {
    cod: string,
    description: string,
    endPoint: string,
    usecaseName: string,
    sql: string,
    obs: string
}
export class AvaliadorDoc {

    public static title = "Avaliador"

    public static incluir(): ApiOperationOptions {
        const avaliadorIncluir: IDoc = {
            cod: '1',
            description: 'Método para inclusão de avaliador',
            endPoint: 'avaliador-incluir',
            usecaseName: 'Incluir avaliador',
            sql: 'sql utilizado...',
            obs: 'Ex: listar tabelas envolvidas/relacionadas'
          };
        return {
            summary: `| Requisito: ${avaliadorIncluir.usecaseName} | Cod: ${avaliadorIncluir.cod}`,
            description: `${avaliadorIncluir.description} | ${avaliadorIncluir.sql}`
        };
    }

    public static consultar(): ApiOperationOptions {

        const obsAvaliadorConsultar = `
            ...
            Tabelas utilizadas: 
            PUBLIC.AVALIADOR
            ...
        `;
        
        const autorizacaoConsultar: IDoc = {
            cod: `2`,
            description: `Método para consulta dos dados do avaliador`,
            endPoint: `avaliador-consultar`,
            usecaseName: `Consultar Avaliador`,
            sql: 'sql utilizado...',
            obs: 'Ex: listar tabelas envolvidas/relacionadas'
          };
        return {
            summary: `| Requisito: ${autorizacaoConsultar.usecaseName} | cod: ${autorizacaoConsultar.cod}`,
            description: `${autorizacaoConsultar.description} | ${autorizacaoConsultar.sql}`
        };
    }

}