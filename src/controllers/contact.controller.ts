import { Request, Response, NextFunction } from 'express';
import { EntityManager } from '@mikro-orm/postgresql';
import { ContactService } from '../services/contact.service';
import { buildSuccessRto, buildPaginatedSuccessRto } from '../rtos/api-response.rto';
import { AppError } from '../utils/app-error';
import { extractSingleStringParam, extractOptionalStringParam } from '../utils/request.util';

export class ContactController {
  private static getService(request: Request): ContactService {
    const entityManager = request.em as EntityManager;
    const isEntityManagerMissing = !entityManager;
    if (isEntityManagerMissing) {
      throw AppError.internal('Entity manager not attached to request context');
    }
    return new ContactService(entityManager);
  }

  static async createContact(request: Request, response: Response, nextFunction: NextFunction): Promise<void> {
    try {
      const contactService = ContactController.getService(request);
      const contactRto = await contactService.createContact(request.body);
      response.status(201).json(buildSuccessRto(contactRto, 'Contact created successfully'));
    } catch (error) {
      nextFunction(error);
    }
  }

  static async getContactById(request: Request, response: Response, nextFunction: NextFunction): Promise<void> {
    try {
      const contactService = ContactController.getService(request);
      const targetContactId = extractSingleStringParam(request.params.id);
      const contactRto = await contactService.getContactById(targetContactId);
      response.status(200).json(buildSuccessRto(contactRto, 'Contact retrieved successfully'));
    } catch (error) {
      nextFunction(error);
    }
  }

  static async getContactsByAccount(request: Request, response: Response, nextFunction: NextFunction): Promise<void> {
    try {
      const contactService = ContactController.getService(request);
      const pageNumber = request.query.page ? Number(request.query.page) : 1;
      const itemsPerPage = request.query.limit ? Number(request.query.limit) : 10;
      const routeAccountId = request.params.accountId ? extractSingleStringParam(request.params.accountId) : undefined;
      const queryAccountId = request.query.accountId ? extractSingleStringParam(request.query.accountId) : undefined;
      const targetAccountId = routeAccountId || queryAccountId;
      const searchFilterText = extractOptionalStringParam(request.query.search);

      const { contacts, total } = await contactService.getContactsByAccount({
        page: pageNumber,
        limit: itemsPerPage,
        search: searchFilterText,
        accountId: targetAccountId,
      });

      response.status(200).json(
        buildPaginatedSuccessRto(contacts, pageNumber, itemsPerPage, total, 'Contacts retrieved successfully')
      );
    } catch (error) {
      nextFunction(error);
    }
  }

  static async updateContact(request: Request, response: Response, nextFunction: NextFunction): Promise<void> {
    try {
      const contactService = ContactController.getService(request);
      const targetContactId = extractSingleStringParam(request.params.id);
      const contactRto = await contactService.updateContact(targetContactId, request.body);
      response.status(200).json(buildSuccessRto(contactRto, 'Contact updated successfully'));
    } catch (error) {
      nextFunction(error);
    }
  }

  static async deleteContact(request: Request, response: Response, nextFunction: NextFunction): Promise<void> {
    try {
      const contactService = ContactController.getService(request);
      const targetContactId = extractSingleStringParam(request.params.id);
      await contactService.deleteContact(targetContactId);
      response.status(200).json(buildSuccessRto(null, 'Contact deleted successfully'));
    } catch (error) {
      nextFunction(error);
    }
  }
}
