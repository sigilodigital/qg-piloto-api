export interface IMessage {
    text: string;
    code: number;
}

export class Message {
    // DEFAULT
    DEFAULT_FALHA?: IMessage = { text: "Falha.", code: 0 };
    DEFAULT_SUCESSO?: IMessage = { text: "Sucesso.", code: 1 };
    // CREATE
    REG_INCL?: IMessage = { text: "Registro incluído.", code: 10 };
    // UPDATE
    REG_ATUA?: IMessage = { text: "Registro atualizado.", code: 11 };
    // DELETE
    REG_REMO?: IMessage = { text: "Registro removido.", code: 12 };
    // FIND
    REG_ENCO?: IMessage = { text: "Registro encontrado.", code: 13 };
    REG_N_ENCONT?: IMessage = { text: "Registro não encontrado.", code: 14 };
    // ERROR - FIELD VALIDATION
    ERR_FIELD_INVA?: IMessage = { text: "Campo inválido.", code: 20 };
    ERR_FIELD_N_SOLI?: IMessage = { text: "Campo @campo não solicitado.", code: 21 };
    ERR_FIELD_N_INFO?: IMessage = { text: "Campo @campo não informado.", code: 22 };
    ERR_FIELD_TIPO?: IMessage = { text: "Tipo do campo @campo é inválido.", code: 23 };
    ERR_FIELD_TAM?: IMessage = { text: "Tamanho do campo @campo é inválido.", code: 24 };
    ERR_FIELD_VALOR?: IMessage = { text: "Valor do campo @campo é inválido.", code: 25 };
    // ERROR - AUTH
    // ERROR - AUTH_USR
    ERR_AUTH_USR_N_ENCONT?: IMessage = { text: "Usuário não encontrado.", code: 80 };
    ERR_AUTH_USR_INATIV?: IMessage = { text: "Usuário inativado.", code: 81 };
    ERR_AUTH_USR_N_AUTENT?: IMessage = { text: "Usuário não autenticado.", code: 82 };
    ERR_AUTH_USR_SENHA_BLOQUEADA?: IMessage = { text: "Usuário com senha bloqueada.", code: 83 };
    ERR_AUTH_USR_N_METODO?: IMessage = { text: "Usuário não tem acesso ao método solicitado.", code: 84 };
    ERR_AUTH_USR_ACES_PUB_NEGADO?: IMessage = { text: "Acesso público negado.", code: 85 };
    // ERROR - AUTH_PROFILE
    ERR_AUTH_PROFILE_N_METODO?: IMessage = { text: "Perfil não tem acesso ao método solicitado.", code: 89 };
    // ERROR - AUTH_SYS
    ERR_AUTH_SYS_N_ENCONT?: IMessage = { text: "Sistema não encontrado.", code: 90 };
    ERR_AUTH_SYS_INATIV?: IMessage = { text: "Sistema inativado.", code: 91 };
    ERR_AUTH_SYS_N_AUTENT?: IMessage = { text: "Sistema não autenticado.", code: 92 };
    ERR_AUTH_SYS_N_METODO?: IMessage = { text: "Sistema não tem acesso ao método solicitado.", code: 93 };
    // ERROR - FIND
    ERR_FIND_CONSU_EXTERNA?: IMessage = { text: "Consulta externa não encontrada.", code: 30 };
    ERR_FIND_URL_INVALIDA?: IMessage = { text: "URL inválida.", code: 31 };
    ERR_FIND_CEP_N_ENCONT?: IMessage = { text: "CEP não encontrado.", code: 32 }
};

// // CONTINUAR CORREÇÃO DAQUI --------------------------------
// TROCAR: { text: "Falha. Campo @campo não é compatível com o tipo da pessoa do cod_cpf_cnpj informado.", code: 18},
// TROCAR: { text: "Falha. Usuário externo já cadastrado.", code: 19},
// TROCAR: { text: "Falha. UF @valor não cadastrada na base.", code: 21},
// TROCAR: { text: "Falha. UF @valor inativa.", code: 22},
// TROCAR: { text: "Falha. Estado civil @valor não cadastrado na base.", code: 23},
// TROCAR: { text: "Falha. Estado civil @valor inativo.", code: 24},
// TROCAR: { text: "Falha. País @valor não cadastrado na base.", code: 25},
// TROCAR: { text: "Falha. País @valor inativo.", code: 26},
// TROCAR: { text: "Falha. Tipo de arquivo pessoal @valor não cadastrado na base.", code: 27},
// TROCAR: { text: "Falha. Tipo de arquivo pessoal @valor inativo.", code: 28},
// TROCAR: { text: "Falha. Não existe registro para o cod_cpf_cnpj e cod_interessado informados.", code: 29},
// TROCAR: { text: "Falha. Tipo de telefone @valor não cadastrado na base.", code: 30},
// TROCAR: { text: "Falha. Tipo de telefone @valor inativo.", code: 31},
// TROCAR: { text: "Falha. Pergunta secreta @valor não cadastrada na base.", code: 32},
// TROCAR: { text: "Falha. Pergunta secreta @valor inativa.", code: 33},
// TROCAR: { text: "Falha. Tipo de relacionamento fiscal @valor não cadastrado na base.", code: 34},
// TROCAR: { text: "Falha. Tipo de relacionamento fiscal @valor inativo.", code: 35},
// TROCAR: { text: "Falha. @campo @valor informado inválido.", code: 36},
// TROCAR: { text: "Falha. Tamanho do arquivo do campo @campo é maior que <tamanho máximo do definido para o arquivo>.", code: 37},
// TROCAR: { text: "Falha. Extensão do arquivo do campo @campo é maior que diferente de @campo.", code: 38},
// TROCAR: { text: "Formato do @campo inválido.", code: 39},
// TROCAR: { text: "Operação realizada.", code: 40},
// TROCAR: { text: "Senha atual não confere.", code: 41},
// TROCAR: { text: "Senha bloqueada.", code: 42},
// TROCAR: { text: "Falha ao salvar.", code: 43},
// TROCAR: { text: "Senha validada. A senha do usuário deve ser alterada.", code: 44},
// TROCAR: { text: "Usuário inativo.", code: 45},
// TROCAR: { text: "Senha validada.", code: 46},
// TROCAR: { text: "Dados não conferem.", code: 47},
// TROCAR: { text: "Verificação de pergunta secreta bloqueada.", code: 48},
// TROCAR: { text: "Falha. A situação da autorização não permite aceite pelo usuário autorizado.", code: 49},
// TROCAR: { text: "Falha. A situação da autorização não permite rejeição pelo usuário autorizado.", code: 50},
// TROCAR: { text: "Falha. A situação da autorização não permite revogação pelo usuário autorizador.", code: 51},
// TROCAR: { text: "Falha. Usuário autorizador não existe.", code: 52},
// TROCAR: { text: "Falha. Usuário autorizado não existe.", code: 53},
// TROCAR: { text: "Falha. A situação da procuração não permite cancelamento.", code: 54},
// TROCAR: { text: "Falha. Usuário procurador não existe.", code: 55},
// TROCAR: { text: "Falha. Pessoa outorgante não existe.", code: 56},
// TROCAR: { text: "Falha. Procurador e Outorgante não pode ser a mesma pessoa.", code: 57},
// TROCAR: { text: "Falha. Data inválida.", code: 58},
// TROCAR: { text: "Falha de processamento!", code: 60},
// TROCAR: { text: "Falha. Token não informado.", code: 77},
// TROCAR: { text: "Falha. Token inválido.", code: 78},
// TROCAR: { text: "Falha. Token expirado.", code: 79},
// TROCAR: { text: "Falha. Token mal formado.", code: 80},
// };