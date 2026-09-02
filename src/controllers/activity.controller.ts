import { Request, Response, NextFunction } from 'express';
import { EntityManager } from '@mikro-orm/postgresql';
import { ActivityService } from '../services/activity.service';
import { buildSuccessRto } from '../rtos/api-response.rto';
import { AppError } from '../utils/app-error';

export class ActivityController {
  private static getService(req: Request): ActivityService {
    const em = req.em as EntityManager;
    if (!em) {
      throw AppError.internal('Entity manager not attached to request context');
    }
    return new ActivityService(em);
  }

  static async createActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = ActivityController.getService(req);
      const activityRto = await service.createActivity(req.body);
      res.status(201).json(buildSuccessRto(activityRto, 'Activity logged successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async getActivityById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = ActivityController.getService(req);
      const activityRto = await service.getActivityById(req.params.id);
      res.status(200).json(buildSuccessRto(activityRto, 'Activity retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async getActivities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = ActivityController.getService(req);
      const query = {
        ...req.query,
        accountId: req.params.accountId || req.query.accountId,
      };
      const { activities, total } = await service.getActivities(query as never);
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

      res.status(200).json(
        buildSuccessRto(activities, 'Activities retrieved successfully', {
          page,
          limit,
          total,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = ActivityController.getService(req);
      const activityRto = await service.updateActivity(req.params.id, req.body);
      res.status(200).json(buildSuccessRto(activityRto, 'Activity updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async deleteActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = ActivityController.getService(req);
      await service.deleteActivity(req.params.id);
      res.status(200).json(buildSuccessRto(null, 'Activity deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}
