import { Request, Response, NextFunction } from 'express';
import { EntityManager } from '@mikro-orm/postgresql';
import { AccountService } from '../services/account.service';
import { buildSuccessRto, buildPaginatedSuccessRto } from '../rtos/api-response.rto';
import { AppError } from '../utils/app-error';
import { extractSingleStringParam, extractOptionalStringParam } from '../utils/request.util';
import { AccountType, Segment, HealthStatus, LifecycleStage, RecordStatus } from '../enums/account.enum';

export class AccountController {
  private static getService(request: Request): AccountService {
    const entityManager = request.em as EntityManager;
    const isEntityManagerMissing = !entityManager;
    if (isEntityManagerMissing) {
      throw AppError.internal('Entity manager not attached to request context');
    }
    return new AccountService(entityManager);
  }

  static async createAccount(request: Request, response: Response, nextFunction: NextFunction): Promise<void> {
    try {
      const accountService = AccountController.getService(request);
      const accountRto = await accountService.createAccount(request.body);
      response.status(201).json(buildSuccessRto(accountRto, 'Account created successfully'));
    } catch (error) {
      nextFunction(error);
    }
  }

  static async getAccountById(request: Request, response: Response, nextFunction: NextFunction): Promise<void> {
    try {
      const accountService = AccountController.getService(request);
      const targetAccountId = extractSingleStringParam(request.params.id);
      const accountRto = await accountService.getAccountById(targetAccountId);
      response.status(200).json(buildSuccessRto(accountRto, 'Account retrieved successfully'));
    } catch (error) {
      nextFunction(error);
    }
  }

  static async getAllAccounts(request: Request, response: Response, nextFunction: NextFunction): Promise<void> {
    try {
      const accountService = AccountController.getService(request);
      const pageNumber = request.query.page ? Number(request.query.page) : 1;
      const itemsPerPage = request.query.limit ? Number(request.query.limit) : 10;
      const searchFilterText = extractOptionalStringParam(request.query.search);

      const { accounts, total } = await accountService.getAllAccounts({
        page: pageNumber,
        limit: itemsPerPage,
        search: searchFilterText,
        accountType: request.query.accountType as AccountType | undefined,
        segment: request.query.segment as Segment | undefined,
        healthStatus: request.query.healthStatus as HealthStatus | undefined,
        lifecycleStage: request.query.lifecycleStage as LifecycleStage | undefined,
        recordStatus: request.query.recordStatus as RecordStatus | undefined,
      });

      response.status(200).json(
        buildPaginatedSuccessRto(accounts, pageNumber, itemsPerPage, total, 'Accounts retrieved successfully')
      );
    } catch (error) {
      nextFunction(error);
    }
  }

  static async updateAccount(request: Request, response: Response, nextFunction: NextFunction): Promise<void> {
    try {
      const accountService = AccountController.getService(request);
      const targetAccountId = extractSingleStringParam(request.params.id);
      const accountRto = await accountService.updateAccount(targetAccountId, request.body);
      response.status(200).json(buildSuccessRto(accountRto, 'Account updated successfully'));
    } catch (error) {
      nextFunction(error);
    }
  }

  static async deleteAccount(request: Request, response: Response, nextFunction: NextFunction): Promise<void> {
    try {
      const accountService = AccountController.getService(request);
      const targetAccountId = extractSingleStringParam(request.params.id);
      await accountService.deleteAccount(targetAccountId);
      response.status(200).json(buildSuccessRto(null, 'Account deleted successfully'));
    } catch (error) {
      nextFunction(error);
    }
  }
}
