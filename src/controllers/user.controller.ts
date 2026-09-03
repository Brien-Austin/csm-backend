import { Request, Response, NextFunction } from 'express';
import { EntityManager } from '@mikro-orm/postgresql';
import { UserService } from '../services/user.service';
import { buildSuccessRto, buildPaginatedSuccessRto } from '../rtos/api-response.rto';
import { AppError } from '../utils/app-error';
import { extractSingleStringParam, extractOptionalStringParam } from '../utils/request.util';

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
      const targetUserId = extractSingleStringParam(request.params.id);
      const userRto = await userService.getUserById(targetUserId);
      response.status(200).json(buildSuccessRto(userRto, 'User retrieved successfully'));
    } catch (error) {
      nextFunction(error);
    }
  }

  static async getAllUsers(request: Request, response: Response, nextFunction: NextFunction): Promise<void> {
    try {
      const userService = UserController.getService(request);
      const pageNumber = request.query.page ? Number(request.query.page) : 1;
      const itemsPerPage = request.query.limit ? Number(request.query.limit) : 10;
      const searchFilterText = extractOptionalStringParam(request.query.search);

      const paginatedResult = await userService.getAllUsers({
        page: pageNumber,
        limit: itemsPerPage,
        search: searchFilterText,
      });

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
      const targetUserId = extractSingleStringParam(request.params.id);
      const userRto = await userService.updateUser(targetUserId, request.body);
      response.status(200).json(buildSuccessRto(userRto, 'User updated successfully'));
    } catch (error) {
      nextFunction(error);
    }
  }

  static async deleteUser(request: Request, response: Response, nextFunction: NextFunction): Promise<void> {
    try {
      const userService = UserController.getService(request);
      const targetUserId = extractSingleStringParam(request.params.id);
      await userService.deleteUser(targetUserId);
      response.status(200).json(buildSuccessRto(null, 'User deleted successfully'));
    } catch (error) {
      nextFunction(error);
    }
  }
}
