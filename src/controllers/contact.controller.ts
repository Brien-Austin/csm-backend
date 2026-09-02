import { Request, Response, NextFunction } from 'express';
import { EntityManager } from '@mikro-orm/postgresql';
import { ContactService } from '../services/contact.service';
import { buildSuccessRto } from '../rtos/api-response.rto';
import { AppError } from '../utils/app-error';

export class ContactController {
  private static getService(req: Request): ContactService {
    const em = req.em as EntityManager;
    if (!em) {
      throw AppError.internal('Entity manager not attached to request context');
    }
    return new ContactService(em);
  }

  static async createContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = ContactController.getService(req);
      const contactRto = await service.createContact(req.body);
      res.status(201).json(buildSuccessRto(contactRto, 'Contact created successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async getContactById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = ContactController.getService(req);
      const contactRto = await service.getContactById(req.params.id);
      res.status(200).json(buildSuccessRto(contactRto, 'Contact retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async getContactsByAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = ContactController.getService(req);
      const query = {
        ...req.query,
        accountId: req.params.accountId || req.query.accountId,
      };
      const { contacts, total } = await service.getContactsByAccount(query as never);
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

      res.status(200).json(
        buildSuccessRto(contacts, 'Contacts retrieved successfully', {
          page,
          limit,
          total,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = ContactController.getService(req);
      const contactRto = await service.updateContact(req.params.id, req.body);
      res.status(200).json(buildSuccessRto(contactRto, 'Contact updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async deleteContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = ContactController.getService(req);
      await service.deleteContact(req.params.id);
      res.status(200).json(buildSuccessRto(null, 'Contact deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}
