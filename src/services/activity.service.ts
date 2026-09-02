import { EntityManager } from '@mikro-orm/postgresql';
import { ActivityEntity } from '../entities/activity.entity';
import { AccountEntity } from '../entities/account.entity';
import { ContactEntity } from '../entities/contact.entity';
import { UserEntity } from '../entities/user.entity';
import { CreateActivityDto, UpdateActivityDto, ActivityQueryDto } from '../dtos/activity.dto';
import { ActivityRto, toActivityRto, toActivityRtoCollection } from '../rtos/activity.rto';
import { AppError } from '../utils/app-error';

export class ActivityService {
  constructor(private readonly entityManager: EntityManager) {}

  async createActivity(activityInputData: CreateActivityDto): Promise<ActivityRto> {
    const parentAccountEntity = await this.entityManager.findOne(AccountEntity, {
      id: activityInputData.accountId,
    });
    
    const isParentAccountMissing = !parentAccountEntity;
    if (isParentAccountMissing) {
      throw AppError.notFound(`Account with ID '${activityInputData.accountId}' not found`);
    }

    const hasContactId = Boolean(activityInputData.contactId);
    const relatedContactEntity = hasContactId
      ? await this.entityManager.findOne(ContactEntity, { id: activityInputData.contactId })
      : null;

    const isRelatedContactMissing = hasContactId && !relatedContactEntity;
    if (isRelatedContactMissing) {
      throw AppError.notFound(`Contact with ID '${activityInputData.contactId}' not found`);
    }

    const hasPerformedById = Boolean(activityInputData.performedById);
    const performingUserEntity = hasPerformedById
      ? await this.entityManager.findOne(UserEntity, { id: activityInputData.performedById })
      : null;

    const activityDateValue = activityInputData.activityDate
      ? new Date(activityInputData.activityDate)
      : new Date();

    const newActivityEntity = new ActivityEntity({
      account: parentAccountEntity,
      subject: activityInputData.subject,
      type: activityInputData.type,
      activityDate: activityDateValue,
      description: activityInputData.description,
      contact: relatedContactEntity || undefined,
      performedBy: performingUserEntity || undefined,
    });

    await this.entityManager.persistAndFlush(newActivityEntity);
    return toActivityRto(newActivityEntity);
  }

  async getActivityById(activityId: string): Promise<ActivityRto> {
    const foundActivityEntity = await this.entityManager.findOne(
      ActivityEntity,
      { id: activityId },
      { populate: ['account', 'contact', 'performedBy'] }
    );

    const isActivityNotFound = !foundActivityEntity;
    if (isActivityNotFound) {
      throw AppError.notFound(`Activity with ID '${activityId}' not found`);
    }

    return toActivityRto(foundActivityEntity);
  }

  async getActivities(filterOptions: ActivityQueryDto): Promise<{ activities: ActivityRto[]; total: number }> {
    const pageNumber = filterOptions.page || 1;
    const itemsPerPage = filterOptions.limit || 10;
    const searchFilterText = filterOptions.search;
    const targetAccountId = filterOptions.accountId;
    const activityTypeFilter = filterOptions.type;
    const queryOffset = (pageNumber - 1) * itemsPerPage;

    const hasAccountIdFilter = Boolean(targetAccountId);
    const hasActivityTypeFilter = Boolean(activityTypeFilter);
    const hasSearchFilterText = Boolean(searchFilterText);

    const searchCondition = hasSearchFilterText
      ? [
          { subject: { $ilike: `%${searchFilterText}%` } },
          { description: { $ilike: `%${searchFilterText}%` } },
        ]
      : [];

    const queryFilters = {
      ...(hasAccountIdFilter ? { account: targetAccountId } : {}),
      ...(hasActivityTypeFilter ? { type: activityTypeFilter } : {}),
      ...(hasSearchFilterText ? { $or: searchCondition } : {}),
    };

    const [activityEntitiesList, totalActivitiesCount] = await this.entityManager.findAndCount(
      ActivityEntity,
      queryFilters,
      {
        limit: itemsPerPage,
        offset: queryOffset,
        orderBy: { activityDate: 'DESC' },
        populate: ['account', 'contact', 'performedBy'],
      }
    );

    return {
      activities: toActivityRtoCollection(activityEntitiesList),
      total: totalActivitiesCount,
    };
  }

  async updateActivity(activityId: string, updateInputData: UpdateActivityDto): Promise<ActivityRto> {
    const existingActivityEntity = await this.entityManager.findOne(
      ActivityEntity,
      { id: activityId },
      { populate: ['account', 'contact', 'performedBy'] }
    );

    const isActivityNotFound = !existingActivityEntity;
    if (isActivityNotFound) {
      throw AppError.notFound(`Activity with ID '${activityId}' not found`);
    }

    this.entityManager.assign(existingActivityEntity, updateInputData);
    await this.entityManager.flush();

    return toActivityRto(existingActivityEntity);
  }

  async deleteActivity(activityId: string): Promise<void> {
    const existingActivityEntity = await this.entityManager.findOne(ActivityEntity, { id: activityId });

    const isActivityNotFound = !existingActivityEntity;
    if (isActivityNotFound) {
      throw AppError.notFound(`Activity with ID '${activityId}' not found`);
    }

    await this.entityManager.removeAndFlush(existingActivityEntity);
  }
}
