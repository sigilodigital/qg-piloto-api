
require('dotenv/config');

export default () => ({
    server: {
        port: process.env.SRV_PORT
    },
    api: {
        apiConfig: process.env.API_CONFIG,
        apiDadosGerais: process.env.API_DADOS_GERAIS,
        apiTomadorServicos: process.env.API_TOMADOR_SERVICOS,
        apiGestaoAcesso: process.env.API_GESTAO_ACESSO
    },
    globalVars: {
        separador: process.env.SRV_SEPARADOR,
        enableDebugMode: JSON.parse(process.env.SRV_DEBUG_MODE),
        formatDataInput: process.env.FORMAT_DATA_INPUT,
        formatDataOutPut: process.env.FORMAT_DATA_OUTPUT,
        formatDataDB: process.env.FORMAT_DATA_DB,
        separadorData: process.env.SRV_SEPARADOR_DATA
    },
    enviroment: {
        name: process.env.ENVIRONMENT,
        filePath: process.env.FILE_PATH,
        findDirectoryFiles: process.env.FIND_DIRECTORY_FILES
    }
});  