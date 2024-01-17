import { AuditoriaEntity } from "../entities/auditoria.entity";

export interface ITipoAcao {
    tipoAcao: "INCLUIR" | "ALTERAR" | "EXCLUIR";
    codAcao: number;
}

export interface IHistoricoDadosSecundarios {
    dtAcao: Date; // momento em que foi concluído a ação
    chave: string; // id do registro incluído/alterado
    alteracao: string; // "Inclusão|Alteração de registro" <NOME_PROPRIEDADE>: DE: <VALOR_ANTIGO> PARA: <VALOR_NOVO>
    dePara: string | null; // propriedades de objeto alteradas
}

export interface IHistoricoDadosPrimarios {
    codOrigem: number; // codigo do cliente que partiu a ação
    codAcao: number; // codigo da ação solicitada
    usuarioId: string, // id de quem executou a ação
    txtEnderecoIp: string; // IP do dispositivo que partiu a ação
    txtEnderecoNome: string;
}

export class AuditoriaEventListDto {

    public events: AuditoriaEntity[];

    constructor() {
        this.events = [];
    }

    add(input: AuditoriaEntity) {
        this.events.push(input);
    }

    get() {
        return this.events;
    }

    resetEvents() {
        this.events = [];
    }
}