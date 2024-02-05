import { env } from "../databases/envSchema";

export default () => ({
    auth: {
        secretKey: env.AUTH_SECRET_KEY,
        expiresIn: {
            bearer: env.AUTH_EXP_BEARER,
            replace: env.AUTH_EXP_REPLACE
        }
    },
    server: {
        port: env.SRV_PORT,
        filePath: env.SRV_FILE_PATH,
    },
    apis: {
        apiConfigGerais: env.API_CONFIG_GERAIS,
        apiDadosGerais: env.API_DADOS_GERAIS,
        apiGestaoAcesso: env.API_GESTAO_ACESSO
    },
    enviroment: {
        isDebugMode: JSON.parse(env.SRV_DEBUG_MODE),
    }
});  