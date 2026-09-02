import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import path from 'path';
import { env } from './env.config';
import { UserEntity } from '../entities/user.entity';
import { AccountEntity } from '../entities/account.entity';
import { ContactEntity } from '../entities/contact.entity';
import { ActivityEntity } from '../entities/activity.entity';
import { TaskEntity } from '../entities/task.entity';

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
  entities: [UserEntity, AccountEntity, ContactEntity, ActivityEntity, TaskEntity],
  entitiesTs: [UserEntity, AccountEntity, ContactEntity, ActivityEntity, TaskEntity],
  metadataProvider: TsMorphMetadataProvider,
  debug: env.NODE_ENV === 'development',
  schemaGenerator: {
    createSchema: true,
    ignoreSchema: ['auth', 'storage', 'realtime', 'vault', 'extensions', 'graphql', 'pg_catalog', 'information_schema', 'pgsodium', 'net', 'graphql_public'],
  },
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
  flushMode: 0,
  allowGlobalContext: false,
});
