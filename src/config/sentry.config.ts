import * as Sentry from '@sentry/node';
import { env } from './env.config';

export const initSentry = (): void => {
  if (!env.SENTRY_DSN || env.SENTRY_DSN.includes('example')) {
    console.log('ℹ️  Sentry DSN not provided or placeholder detected. Sentry error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.SENTRY_ENVIRONMENT,
    tracesSampleRate: env.SENTRY_TRACES_SAMPLE_RATE,
  });

  console.log(`⚡ Sentry initialized [Environment: ${env.SENTRY_ENVIRONMENT}]`);
};

export { Sentry };
