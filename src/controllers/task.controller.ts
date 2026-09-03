import { Request, Response, NextFunction } from 'express';
import { EntityManager } from '@mikro-orm/postgresql';
import { TaskService } from '../services/task.service';
import { buildSuccessRto, buildPaginatedSuccessRto } from '../rtos/api-response.rto';
import { AppError } from '../utils/app-error';
import { extractSingleStringParam, extractOptionalStringParam } from '../utils/request.util';
import { TaskStatus, TaskPriority } from '../enums/task.enum';

export class TaskController {
  private static getService(request: Request): TaskService {
    const entityManager = request.em as EntityManager;
    const isEntityManagerMissing = !entityManager;
    if (isEntityManagerMissing) {
      throw AppError.internal('Entity manager not attached to request context');
    }
    return new TaskService(entityManager);
  }

  static async createTask(request: Request, response: Response, nextFunction: NextFunction): Promise<void> {
    try {
      const taskService = TaskController.getService(request);
      const taskRto = await taskService.createTask(request.body);
      response.status(201).json(buildSuccessRto(taskRto, 'Task created successfully'));
    } catch (error) {
      nextFunction(error);
    }
  }

  static async getTaskById(request: Request, response: Response, nextFunction: NextFunction): Promise<void> {
    try {
      const taskService = TaskController.getService(request);
      const targetTaskId = extractSingleStringParam(request.params.id);
      const taskRto = await taskService.getTaskById(targetTaskId);
      response.status(200).json(buildSuccessRto(taskRto, 'Task retrieved successfully'));
    } catch (error) {
      nextFunction(error);
    }
  }

  static async getTasks(request: Request, response: Response, nextFunction: NextFunction): Promise<void> {
    try {
      const taskService = TaskController.getService(request);
      const pageNumber = request.query.page ? Number(request.query.page) : 1;
      const itemsPerPage = request.query.limit ? Number(request.query.limit) : 10;
      const routeAccountId = request.params.accountId ? extractSingleStringParam(request.params.accountId) : undefined;
      const queryAccountId = request.query.accountId ? extractSingleStringParam(request.query.accountId) : undefined;
      const targetAccountId = routeAccountId || queryAccountId;
      const searchFilterText = extractOptionalStringParam(request.query.search);

      const { tasks, total } = await taskService.getTasks({
        page: pageNumber,
        limit: itemsPerPage,
        search: searchFilterText,
        accountId: targetAccountId,
        status: request.query.status as TaskStatus | undefined,
        priority: request.query.priority as TaskPriority | undefined,
      });

      response.status(200).json(
        buildPaginatedSuccessRto(tasks, pageNumber, itemsPerPage, total, 'Tasks retrieved successfully')
      );
    } catch (error) {
      nextFunction(error);
    }
  }

  static async updateTask(request: Request, response: Response, nextFunction: NextFunction): Promise<void> {
    try {
      const taskService = TaskController.getService(request);
      const targetTaskId = extractSingleStringParam(request.params.id);
      const taskRto = await taskService.updateTask(targetTaskId, request.body);
      response.status(200).json(buildSuccessRto(taskRto, 'Task updated successfully'));
    } catch (error) {
      nextFunction(error);
    }
  }

  static async deleteTask(request: Request, response: Response, nextFunction: NextFunction): Promise<void> {
    try {
      const taskService = TaskController.getService(request);
      const targetTaskId = extractSingleStringParam(request.params.id);
      await taskService.deleteTask(targetTaskId);
      response.status(200).json(buildSuccessRto(null, 'Task deleted successfully'));
    } catch (error) {
      nextFunction(error);
    }
  }
}
