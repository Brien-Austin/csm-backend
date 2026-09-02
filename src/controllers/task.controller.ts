import { Request, Response, NextFunction } from 'express';
import { EntityManager } from '@mikro-orm/postgresql';
import { TaskService } from '../services/task.service';
import { buildSuccessRto } from '../rtos/api-response.rto';
import { AppError } from '../utils/app-error';

export class TaskController {
  private static getService(req: Request): TaskService {
    const em = req.em as EntityManager;
    if (!em) {
      throw AppError.internal('Entity manager not attached to request context');
    }
    return new TaskService(em);
  }

  static async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = TaskController.getService(req);
      const taskRto = await service.createTask(req.body);
      res.status(201).json(buildSuccessRto(taskRto, 'Task created successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = TaskController.getService(req);
      const taskRto = await service.getTaskById(req.params.id);
      res.status(200).json(buildSuccessRto(taskRto, 'Task retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = TaskController.getService(req);
      const query = {
        ...req.query,
        accountId: req.params.accountId || req.query.accountId,
      };
      const { tasks, total } = await service.getTasks(query as never);
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

      res.status(200).json(
        buildSuccessRto(tasks, 'Tasks retrieved successfully', {
          page,
          limit,
          total,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = TaskController.getService(req);
      const taskRto = await service.updateTask(req.params.id, req.body);
      res.status(200).json(buildSuccessRto(taskRto, 'Task updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = TaskController.getService(req);
      await service.deleteTask(req.params.id);
      res.status(200).json(buildSuccessRto(null, 'Task deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}
