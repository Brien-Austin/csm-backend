import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import path from 'path';
import { env } from './env.config';

export default defineConfig({
  host: env.DB_HOST,
  port: env.DB_PORT,
  dbName: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  clientUrl: env.DB_CLIENT_URL,
  driverOptions: env.DB_SSL
    ? {
        connection: {
          ssl: { rejectUnauthorized: false },
        },
      }
    : undefined,
  pool: {
    min: env.DB_POOL_MIN,
    max: env.DB_POOL_MAX,
    idleTimeoutMillis: 30000,
  },
  entities: ['./dist/entities/**/*.js'],
  entitiesTs: ['./src/entities/**/*.ts'],
  metadataProvider: TsMorphMetadataProvider,
  debug: env.NODE_ENV === 'development',
  extensions: [Migrator],
  migrations: {
    path: path.join(process.cwd(), 'dist/migrations'),
    pathTs: path.join(process.cwd(), 'src/migrations'),
    glob: '!(*.d).{js,ts}',
    transactional: true,
    disableForeignKeys: true,
    allOrNothing: true,
    dropTables: true,
    safe: false,
    snapshot: true,
    fileName: (timestamp: string, name?: string) =>
      `Migration${timestamp}${name ? '_' + name : ''}`,
  },
  // High performance & memory optimization settings
  flushMode: 0, // FlushMode.AUTO
  allowGlobalContext: false, // Force RequestContext middleware usage to avoid memory leaks
});
