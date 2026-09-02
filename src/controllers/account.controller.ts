import { Request, Response, NextFunction } from 'express';
import { EntityManager } from '@mikro-orm/postgresql';
import { AccountService } from '../services/account.service';
import { buildSuccessRto } from '../rtos/api-response.rto';
import { AppError } from '../utils/app-error';

export class AccountController {
  private static getService(req: Request): AccountService {
    const em = req.em as EntityManager;
    if (!em) {
      throw AppError.internal('Entity manager not attached to request context');
    }
    return new AccountService(em);
  }

  static async createAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = AccountController.getService(req);
      const accountRto = await service.createAccount(req.body);
      res.status(201).json(buildSuccessRto(accountRto, 'Account created successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async getAccountById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = AccountController.getService(req);
      const accountRto = await service.getAccountById(req.params.id);
      res.status(200).json(buildSuccessRto(accountRto, 'Account retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async getAllAccounts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = AccountController.getService(req);
      const { accounts, total } = await service.getAllAccounts(req.query as never);
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

      res.status(200).json(
        buildSuccessRto(accounts, 'Accounts retrieved successfully', {
          page,
          limit,
          total,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = AccountController.getService(req);
      const accountRto = await service.updateAccount(req.params.id, req.body);
      res.status(200).json(buildSuccessRto(accountRto, 'Account updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = AccountController.getService(req);
      await service.deleteAccount(req.params.id);
      res.status(200).json(buildSuccessRto(null, 'Account deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}
