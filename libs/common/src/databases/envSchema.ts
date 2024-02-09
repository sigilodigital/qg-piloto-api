require('dotenv/config');

import { z } from 'zod';

const envSchema = z.object({
    PROJECT_NAME: z.string().trim().min(1),

    AUTH_SECRET_KEY: z.string().trim().min(1),
    AUTH_EXP_BEARER: z.string().trim().regex(/^\d*(s|m|h|d|y)$/, '.ENV - FORMATO INVALIDO'),
    AUTH_EXP_REPLACE: z.string().trim().regex(/^\d*(s|m|h|d|y)$/, '.ENV - FORMATO INVALIDO'),

    SRV_PORT: z.string().trim().regex(/^\d*$/, '.ENV - INSERIR SOMENTE NUMEROS'),
    SRV_FILE_PATH: z.string(),
    SRV_DEBUG_MODE: z.string().trim().regex(/(true|false|0|1)/),

    DB_TYPE: z.string().trim().min(1),
    DB_HOST: z.string().trim().min(1),
    DB_PORT: z.string().trim().regex(/^\d*$/, '.ENV - INSERIR SOMENTE NUMEROS'),
    DB_NAME: z.string().trim().min(1),
    DB_SCHEMA: z.string().trim().min(1),
    DB_USERNAME: z.string().trim().min(1),
    DB_PASSWORD: z.string().trim().min(1),
    DB_SERVICE_NAME: z.string(),

    API_GESTAO_ACESSO: z.string(),
    API_DADOS_GERAIS: z.string(),
    API_CONFIG_GERAIS: z.string(),

    NEST_DEBUG: z.string().trim().regex(/(true|false|0|1)/),
});

export const env = envSchema.parse(process.env)