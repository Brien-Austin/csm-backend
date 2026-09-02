import { EntityManager } from '@mikro-orm/core';

declare global {
  namespace Express {
    interface Request {
      em?: EntityManager;
      startTime?: number;
    }
  }
}
