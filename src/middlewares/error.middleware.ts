import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';
import { buildErrorRto } from '../rtos/api-response.rto';
import { Sentry } from '../config/sentry.config';
import { logger } from '../utils/logger';

export const errorHandlerMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    logger.warn(`Operational Error: ${err.message}`, {
      statusCode: err.statusCode,
      errorCode: err.errorCode,
      details: err.details,
    });

    res.status(err.statusCode).json(buildErrorRto(err.message, err.errorCode, err.details));
    return;
  }

  // Log unhandled non-operational errors
  logger.error(`Unhandled Server Error: ${err.message}`, { stack: err.stack });

  // Send unhandled exceptions to Sentry
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(err);
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const responseMessage = isProduction ? 'Internal Server Error' : err.message;
  const details = isProduction ? undefined : { stack: err.stack };

  res.status(500).json(buildErrorRto(responseMessage, 'INTERNAL_SERVER_ERROR', details));
};
