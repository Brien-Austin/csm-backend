import { EntityManager } from '@mikro-orm/postgresql';
import { ContactEntity } from '../entities/contact.entity';
import { AccountEntity } from '../entities/account.entity';
import { CreateContactDto, UpdateContactDto, ContactQueryDto } from '../dtos/contact.dto';
import { ContactRto, toContactRto, toContactRtoCollection } from '../rtos/contact.rto';
import { AppError } from '../utils/app-error';

export class ContactService {
  constructor(private readonly entityManager: EntityManager) {}

  async createContact(contactInputData: CreateContactDto): Promise<ContactRto> {
    const parentAccountEntity = await this.entityManager.findOne(AccountEntity, {
      id: contactInputData.accountId,
    });
    
    const isParentAccountMissing = !parentAccountEntity;
    if (isParentAccountMissing) {
      throw AppError.notFound(`Account with ID '${contactInputData.accountId}' not found`);
    }

    const newContactEntity = new ContactEntity({
      account: parentAccountEntity,
      firstName: contactInputData.firstName,
      lastName: contactInputData.lastName,
      email: contactInputData.email,
      phone: contactInputData.phone,
      title: contactInputData.title,
      isPrimary: contactInputData.isPrimary,
    });

    await this.entityManager.persistAndFlush(newContactEntity);
    return toContactRto(newContactEntity);
  }

  async getContactById(contactId: string): Promise<ContactRto> {
    const foundContactEntity = await this.entityManager.findOne(
      ContactEntity,
      { id: contactId },
      { populate: ['account'] }
    );

    const isContactNotFound = !foundContactEntity;
    if (isContactNotFound) {
      throw AppError.notFound(`Contact with ID '${contactId}' not found`);
    }

    return toContactRto(foundContactEntity);
  }

  async getContactsByAccount(filterOptions: ContactQueryDto): Promise<{ contacts: ContactRto[]; total: number }> {
    const pageNumber = filterOptions.page || 1;
    const itemsPerPage = filterOptions.limit || 10;
    const searchFilterText = filterOptions.search;
    const targetAccountId = filterOptions.accountId;
    const queryOffset = (pageNumber - 1) * itemsPerPage;

    const hasAccountIdFilter = Boolean(targetAccountId);
    const hasSearchFilterText = Boolean(searchFilterText);

    const searchCondition = hasSearchFilterText
      ? [
          { firstName: { $ilike: `%${searchFilterText}%` } },
          { lastName: { $ilike: `%${searchFilterText}%` } },
          { email: { $ilike: `%${searchFilterText}%` } },
        ]
      : [];

    const queryFilters = {
      ...(hasAccountIdFilter ? { account: targetAccountId } : {}),
      ...(hasSearchFilterText ? { $or: searchCondition } : {}),
    };

    const [contactEntitiesList, totalContactsCount] = await this.entityManager.findAndCount(
      ContactEntity,
      queryFilters,
      {
        limit: itemsPerPage,
        offset: queryOffset,
        orderBy: { createdAt: 'DESC' },
        populate: ['account'],
      }
    );

    return {
      contacts: toContactRtoCollection(contactEntitiesList),
      total: totalContactsCount,
    };
  }

  async updateContact(contactId: string, updateInputData: UpdateContactDto): Promise<ContactRto> {
    const existingContactEntity = await this.entityManager.findOne(
      ContactEntity,
      { id: contactId },
      { populate: ['account'] }
    );

    const isContactNotFound = !existingContactEntity;
    if (isContactNotFound) {
      throw AppError.notFound(`Contact with ID '${contactId}' not found`);
    }

    this.entityManager.assign(existingContactEntity, updateInputData);
    await this.entityManager.flush();

    return toContactRto(existingContactEntity);
  }

  async deleteContact(contactId: string): Promise<void> {
    const existingContactEntity = await this.entityManager.findOne(ContactEntity, { id: contactId });

    const isContactNotFound = !existingContactEntity;
    if (isContactNotFound) {
      throw AppError.notFound(`Contact with ID '${contactId}' not found`);
    }

    await this.entityManager.removeAndFlush(existingContactEntity);
  }
}
