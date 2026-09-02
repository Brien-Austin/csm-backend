import { Request, Response, NextFunction } from 'express';
import { EntityManager } from '@mikro-orm/postgresql';
import { buildSuccessRto } from '../rtos/api-response.rto';

export class HealthController {
  static async check(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const em = req.em as EntityManager;
      let dbConnected = false;

      if (em) {
        try {
          await em.getConnection().execute('SELECT 1');
          dbConnected = true;
        } catch {
          dbConnected = false;
        }
      }

      const status = dbConnected ? 200 : 503;

      res.status(status).json(
        buildSuccessRto(
          {
            status: dbConnected ? 'healthy' : 'degraded',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            services: {
              database: dbConnected ? 'connected' : 'disconnected',
            },
          },
          'Health check evaluation complete'
        )
      );
    } catch (error) {
      next(error);
    }
  }
}
