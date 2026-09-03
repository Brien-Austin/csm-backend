import { Request, Response, NextFunction } from 'express';
import { EntityManager } from '@mikro-orm/postgresql';
import { ActivityService } from '../services/activity.service';
import { buildSuccessRto, buildPaginatedSuccessRto } from '../rtos/api-response.rto';
import { AppError } from '../utils/app-error';
import { extractSingleStringParam, extractOptionalStringParam } from '../utils/request.util';
import { ActivityType } from '../enums/activity.enum';

export class ActivityController {
  private static getService(request: Request): ActivityService {
    const entityManager = request.em as EntityManager;
    const isEntityManagerMissing = !entityManager;
    if (isEntityManagerMissing) {
      throw AppError.internal('Entity manager not attached to request context');
    }
    return new ActivityService(entityManager);
  }

  static async createActivity(request: Request, response: Response, nextFunction: NextFunction): Promise<void> {
    try {
      const activityService = ActivityController.getService(request);
      const activityRto = await activityService.createActivity(request.body);
      response.status(201).json(buildSuccessRto(activityRto, 'Activity logged successfully'));
    } catch (error) {
      nextFunction(error);
    }
  }

  static async getActivityById(request: Request, response: Response, nextFunction: NextFunction): Promise<void> {
    try {
      const activityService = ActivityController.getService(request);
      const targetActivityId = extractSingleStringParam(request.params.id);
      const activityRto = await activityService.getActivityById(targetActivityId);
      response.status(200).json(buildSuccessRto(activityRto, 'Activity retrieved successfully'));
    } catch (error) {
      nextFunction(error);
    }
  }

  static async getActivities(request: Request, response: Response, nextFunction: NextFunction): Promise<void> {
    try {
      const activityService = ActivityController.getService(request);
      const pageNumber = request.query.page ? Number(request.query.page) : 1;
      const itemsPerPage = request.query.limit ? Number(request.query.limit) : 10;
      const routeAccountId = request.params.accountId ? extractSingleStringParam(request.params.accountId) : undefined;
      const queryAccountId = request.query.accountId ? extractSingleStringParam(request.query.accountId) : undefined;
      const targetAccountId = routeAccountId || queryAccountId;
      const searchFilterText = extractOptionalStringParam(request.query.search);

      const { activities, total } = await activityService.getActivities({
        page: pageNumber,
        limit: itemsPerPage,
        search: searchFilterText,
        accountId: targetAccountId,
        type: request.query.type as ActivityType | undefined,
      });

      response.status(200).json(
        buildPaginatedSuccessRto(activities, pageNumber, itemsPerPage, total, 'Activities retrieved successfully')
      );
    } catch (error) {
      nextFunction(error);
    }
  }

  static async updateActivity(request: Request, response: Response, nextFunction: NextFunction): Promise<void> {
    try {
      const activityService = ActivityController.getService(request);
      const targetActivityId = extractSingleStringParam(request.params.id);
      const activityRto = await activityService.updateActivity(targetActivityId, request.body);
      response.status(200).json(buildSuccessRto(activityRto, 'Activity updated successfully'));
    } catch (error) {
      nextFunction(error);
    }
  }

  static async deleteActivity(request: Request, response: Response, nextFunction: NextFunction): Promise<void> {
    try {
      const activityService = ActivityController.getService(request);
      const targetActivityId = extractSingleStringParam(request.params.id);
      await activityService.deleteActivity(targetActivityId);
      response.status(200).json(buildSuccessRto(null, 'Activity deleted successfully'));
    } catch (error) {
      nextFunction(error);
    }
  }
}
