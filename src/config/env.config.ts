import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  PORT: z.string().default('4000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().default('*'),

  // PostgreSQL / Supabase DB Config
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().default('5432').transform((val) => parseInt(val, 10)),
  DB_NAME: z.string().default('postgres'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default(''),
  DB_SSL: z
    .string()
    .optional()
    .transform((val) => val === 'true' || val === '1'),
  DB_CLIENT_URL: z.string().optional(),
  DB_POOL_MIN: z.string().default('2').transform((val) => parseInt(val, 10)),
  DB_POOL_MAX: z.string().default('10').transform((val) => parseInt(val, 10)),

  // Sentry
  SENTRY_DSN: z.string().optional(),
  SENTRY_ENVIRONMENT: z.string().default('development'),
  SENTRY_TRACES_SAMPLE_RATE: z
    .string()
    .default('1.0')
    .transform((val) => parseFloat(val)),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment configuration:', _env.error.format());
  throw new Error('Invalid environment configuration');
}

export const env = _env.data;
