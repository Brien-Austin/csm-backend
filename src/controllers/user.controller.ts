import { Request, Response, NextFunction } from 'express';
import { EntityManager } from '@mikro-orm/postgresql';
import { UserService } from '../services/user.service';
import { buildSuccessRto } from '../rtos/api-response.rto';
import { AppError } from '../utils/app-error';

export class UserController {
  private static getService(req: Request): UserService {
    const em = req.em as EntityManager;
    if (!em) {
      throw AppError.internal('Entity manager not attached to request context');
    }
    return new UserService(em);
  }

  static async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userService = UserController.getService(req);
      const userRto = await userService.createUser(req.body);
      res.status(201).json(buildSuccessRto(userRto, 'User created successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userService = UserController.getService(req);
      const userRto = await userService.getUserById(req.params.id);
      res.status(200).json(buildSuccessRto(userRto, 'User retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userService = UserController.getService(req);
      const { users, total } = await userService.getAllUsers(req.query as never);
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

      res.status(200).json(
        buildSuccessRto(users, 'Users retrieved successfully', {
          page,
          limit,
          total,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userService = UserController.getService(req);
      const userRto = await userService.updateUser(req.params.id, req.body);
      res.status(200).json(buildSuccessRto(userRto, 'User updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userService = UserController.getService(req);
      await userService.deleteUser(req.params.id);
      res.status(200).json(buildSuccessRto(null, 'User deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}
