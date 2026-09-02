import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from './config/mikro-orm.config';
import { env } from './config/env.config';
import { createApp } from './app';
import { logger } from './utils/logger';

async function bootstrap(): Promise<void> {
  let orm: MikroORM | undefined;

  try {
    logger.info('🚀 Starting application server...');

    // Connect to PostgreSQL (Supabase) via MikroORM
    logger.info(`🔌 Connecting to Database [Host: ${env.DB_HOST}, DB: ${env.DB_NAME}]...`);
    orm = await MikroORM.init(mikroOrmConfig);
    logger.info('✅ Database connection established successfully');

    // Express Application Setup
    const app = createApp(orm);

    const server = app.listen(env.PORT, () => {
      logger.info(`⚡ Server is running on port ${env.PORT} [Environment: ${env.NODE_ENV}]`);
      logger.info(`🏥 Health Check endpoint available at http://localhost:${env.PORT}/health`);
    });

    // Graceful Shutdown Logic for Memory and Database Pool Safety
    const shutdown = async (signal: string) => {
      logger.info(`⚠️  Received ${signal}. Initiating graceful shutdown...`);

      server.close(async () => {
        logger.info('🛑 HTTP server closed.');
        if (orm) {
          await orm.close(true);
          logger.info('🛑 Database connection closed.');
        }
        process.exit(0);
      });

      // Force shutdown after 10 seconds timeout
      setTimeout(() => {
        logger.error('❌ Forced shutdown due to timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (reason) => {
      logger.error('❌ Unhandled Promise Rejection:', reason);
    });

    process.on('uncaughtException', (err) => {
      logger.error('❌ Uncaught Exception:', err);
      shutdown('UNCAUGHT_EXCEPTION');
    });
  } catch (error) {
    logger.error('❌ Application startup failed:', error);
    if (orm) {
      await orm.close(true);
    }
    process.exit(1);
  }
}

bootstrap();
