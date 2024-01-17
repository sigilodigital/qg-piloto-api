require('dotenv/config');

import { z } from 'zod';

const envSchema = z.object({
    PROJECT_NAME: z.string(),
    JWT_KEY: z.string(),
    SRV_PORT: z.string(),
    DEBUG_MODE: z.string(),
    DB_TYPE: z.string(),
    DB_HOST: z.string(),
    DB_PORT: z.string(),
    DB_USERNAME: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
    DB_SCHEMA: z.string(),
    DB_SERVICE_NAME: z.string(),
    NEST_DEBUG: z.string(),
});

export const env = envSchema.parse(process.env)