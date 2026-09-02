import { Request, Response, NextFunction } from 'express';
import { EntityManager } from '@mikro-orm/postgresql';
import { UserService } from '../services/user.service';
import { buildSuccessRto, buildPaginatedSuccessRto } from '../rtos/api-response.rto';
import { AppError } from '../utils/app-error';

export class UserController {
  private static getService(request: Request): UserService {
    const entityManager = request.em as EntityManager;
    const isEntityManagerMissing = !entityManager;
    if (isEntityManagerMissing) {
      throw AppError.internal('Entity manager not attached to request context');
    }
    return new UserService(entityManager);
  }

  static async createUser(request: Request, response: Response, nextFunction: NextFunction): Promise<void> {
    try {
      const userService = UserController.getService(request);
      const userRto = await userService.createUser(request.body);
      response.status(201).json(buildSuccessRto(userRto, 'User created successfully'));
    } catch (error) {
      nextFunction(error);
    }
  }

  static async getUserById(request: Request, response: Response, nextFunction: NextFunction): Promise<void> {
    try {
      const userService = UserController.getService(request);
      const userRto = await userService.getUserById(request.params.id);
      response.status(200).json(buildSuccessRto(userRto, 'User retrieved successfully'));
    } catch (error) {
      nextFunction(error);
    }
  }

  static async getAllUsers(request: Request, response: Response, nextFunction: NextFunction): Promise<void> {
    try {
      const userService = UserController.getService(request);
      const paginatedResult = await userService.getAllUsers(request.query as never);
      response.status(200).json(
        buildPaginatedSuccessRto(
          paginatedResult.items,
          paginatedResult.page,
          paginatedResult.limit,
          paginatedResult.total,
          'Users list retrieved successfully'
        )
      );
    } catch (error) {
      nextFunction(error);
    }
  }

  static async updateUser(request: Request, response: Response, nextFunction: NextFunction): Promise<void> {
    try {
      const userService = UserController.getService(request);
      const userRto = await userService.updateUser(request.params.id, request.body);
      response.status(200).json(buildSuccessRto(userRto, 'User updated successfully'));
    } catch (error) {
      nextFunction(error);
    }
  }

  static async deleteUser(request: Request, response: Response, nextFunction: NextFunction): Promise<void> {
    try {
      const userService = UserController.getService(request);
      await userService.deleteUser(request.params.id);
      response.status(200).json(buildSuccessRto(null, 'User deleted successfully'));
    } catch (error) {
      nextFunction(error);
    }
  }
}
