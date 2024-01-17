import { ApiOperationOptions } from "@nestjs/swagger";

interface IDoc {
    cod: string,
    description: string,
    endPoint: string,
    usecaseName: string,
    sql: string,
    obs: string
}
export class UsuarioDoc {

    public static title = "Usuário"

    public static incluir(): ApiOperationOptions {
        const usuarioIncluir: IDoc = {
            cod: '1',
            description: 'Método para inclusão de usuário',
            endPoint: 'usuario-incluir',
            usecaseName: 'Incluir usuário',
            sql: 'sql utilizado...',
            obs: 'Ex: listar tabelas envolvidas/relacionadas'
          };
        return {
            summary: `| Requisito: ${usuarioIncluir.usecaseName} | Cod: ${usuarioIncluir.cod}`,
            description: `${usuarioIncluir.description} | ${usuarioIncluir.sql}`
        };
    }

    public static consultar(): ApiOperationOptions {

        const obsUsuarioConsultar = `
            ...
            Tabelas utilizadas: 
            PUBLIC.USUARIO
            ...
        `;
        
        const autorizacaoConsultar: IDoc = {
            cod: `2`,
            description: `Método para consulta dos dados do usuário`,
            endPoint: `usuario-consultar`,
            usecaseName: `Consultar Usuário`,
            sql: 'sql utilizado...',
            obs: 'Ex: listar tabelas envolvidas/relacionadas'
          };
        return {
            summary: `| Requisito: ${autorizacaoConsultar.usecaseName} | cod: ${autorizacaoConsultar.cod}`,
            description: `${autorizacaoConsultar.description} | ${autorizacaoConsultar.sql}`
        };
    }

}