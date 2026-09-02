import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { MikroORM } from '@mikro-orm/core';
import { env } from './config/env.config';
import { initSentry } from './config/sentry.config';
import { createRequestContextMiddleware } from './middlewares/request-context.middleware';
import { requestLoggerMiddleware } from './middlewares/logger.middleware';
import { errorHandlerMiddleware } from './middlewares/error.middleware';
import routes from './routes';
import { AppError } from './utils/app-error';

export const createApp = (orm?: MikroORM): Application => {
  const app: Application = express();

  // Initialize Sentry Monitoring
  initSentry();

  // Security & Utility Middlewares
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));
  app.use(requestLoggerMiddleware);

  // MikroORM Request Context Middleware (Crucial for Memory Isolation)
  if (orm) {
    app.use(createRequestContextMiddleware(orm));
    app.use((req: Request, _res: Response, next: NextFunction) => {
      req.em = orm.em;
      next();
    });
  }

  // Application Routes
  app.use(routes);

  // Handle 404 Not Found
  app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(AppError.notFound('Route not found'));
  });

  // Global Centralized Error Handler Middleware
  app.use(errorHandlerMiddleware);

  return app;
};
