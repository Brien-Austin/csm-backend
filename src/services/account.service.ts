import { EntityManager } from '@mikro-orm/postgresql';
import { AccountEntity } from '../entities/account.entity';
import { UserEntity } from '../entities/user.entity';
import { CreateAccountDto, UpdateAccountDto, AccountQueryDto } from '../dtos/account.dto';
import { AccountRto, toAccountRto, toAccountRtoCollection } from '../rtos/account.rto';
import { AppError } from '../utils/app-error';

export class AccountService {
  constructor(private readonly entityManager: EntityManager) {}

  async createAccount(accountInputData: CreateAccountDto): Promise<AccountRto> {
    const existingAccountWithName = await this.entityManager.findOne(AccountEntity, {
      accountName: accountInputData.accountName,
    });
    
    const isAccountNameAlreadyTaken = Boolean(existingAccountWithName);
    if (isAccountNameAlreadyTaken) {
      throw AppError.conflict(`Account with name '${accountInputData.accountName}' already exists`);
    }

    const hasPrimaryCsmId = Boolean(accountInputData.primaryCsmId);
    const primaryCsmUser = hasPrimaryCsmId
      ? await this.entityManager.findOne(UserEntity, { id: accountInputData.primaryCsmId })
      : null;

    const isPrimaryCsmMissing = hasPrimaryCsmId && !primaryCsmUser;
    if (isPrimaryCsmMissing) {
      throw AppError.notFound(`Primary CSM User '${accountInputData.primaryCsmId}' not found`);
    }

    const hasAccountManagerId = Boolean(accountInputData.accountManagerId);
    const accountManagerUser = hasAccountManagerId
      ? await this.entityManager.findOne(UserEntity, { id: accountInputData.accountManagerId })
      : null;

    const isAccountManagerMissing = hasAccountManagerId && !accountManagerUser;
    if (isAccountManagerMissing) {
      throw AppError.notFound(`Account Manager User '${accountInputData.accountManagerId}' not found`);
    }

    const newAccountEntity = new AccountEntity({
      accountName: accountInputData.accountName,
      externalAccountId: accountInputData.externalAccountId,
      externalSource: accountInputData.externalSource,
      accountType: accountInputData.accountType,
      website: accountInputData.website,
      accountDomain: accountInputData.accountDomain,
      hqCountry: accountInputData.hqCountry,
      hqState: accountInputData.hqState,
      operatingCountries: accountInputData.operatingCountries,
      operatingStates: accountInputData.operatingStates,
      reportingRegion: accountInputData.reportingRegion,
      segment: accountInputData.segment,
      customerType: accountInputData.customerType,
      lifecycleStage: accountInputData.lifecycleStage,
      accountTier: accountInputData.accountTier,
      isStrategic: accountInputData.isStrategic,
      industry: accountInputData.industry,
      companySize: accountInputData.companySize,
      healthStatus: accountInputData.healthStatus,
      riskLevel: accountInputData.riskLevel,
      riskReasons: accountInputData.riskReasons,
      healthNotes: accountInputData.healthNotes,
      healthScore: accountInputData.healthScore,
      primaryCsm: primaryCsmUser || undefined,
      csmTeam: accountInputData.csmTeam,
      accountManager: accountManagerUser || undefined,
      csmStartDate: accountInputData.csmStartDate ? new Date(accountInputData.csmStartDate) : undefined,
      contractStartDate: accountInputData.contractStartDate ? new Date(accountInputData.contractStartDate) : undefined,
      contractEndDate: accountInputData.contractEndDate ? new Date(accountInputData.contractEndDate) : undefined,
      renewalDate: accountInputData.renewalDate ? new Date(accountInputData.renewalDate) : undefined,
      contractValueArr: accountInputData.contractValueArr,
      billingCurrency: accountInputData.billingCurrency,
      planTier: accountInputData.planTier,
      primaryCustomerGoal: accountInputData.primaryCustomerGoal,
      useCases: accountInputData.useCases,
      successCriteria: accountInputData.successCriteria,
      keyProducts: accountInputData.keyProducts,
      customerSince: accountInputData.customerSince ? new Date(accountInputData.customerSince) : undefined,
      onboardingStartDate: accountInputData.onboardingStartDate ? new Date(accountInputData.onboardingStartDate) : undefined,
      goLiveDate: accountInputData.goLiveDate ? new Date(accountInputData.goLiveDate) : undefined,
      lastCsmReviewDate: accountInputData.lastCsmReviewDate ? new Date(accountInputData.lastCsmReviewDate) : undefined,
      nextReviewDate: accountInputData.nextReviewDate ? new Date(accountInputData.nextReviewDate) : undefined,
      recordStatus: accountInputData.recordStatus,
      dataSource: accountInputData.dataSource,
    });

    await this.entityManager.persistAndFlush(newAccountEntity);
    return toAccountRto(newAccountEntity);
  }

  async getAccountById(accountId: string): Promise<AccountRto> {
    const foundAccountEntity = await this.entityManager.findOne(
      AccountEntity,
      { id: accountId },
      { populate: ['primaryCsm', 'accountManager', 'createdBy', 'updatedBy'] }
    );
    
    const isAccountNotFound = !foundAccountEntity;
    if (isAccountNotFound) {
      throw AppError.notFound(`Account with ID '${accountId}' not found`);
    }

    return toAccountRto(foundAccountEntity);
  }

  async getAllAccounts(filterOptions: AccountQueryDto): Promise<{ accounts: AccountRto[]; total: number }> {
    const pageNumber = filterOptions.page || 1;
    const itemsPerPage = filterOptions.limit || 10;
    const searchFilterText = filterOptions.search;
    const queryOffset = (pageNumber - 1) * itemsPerPage;

    const hasSearchText = Boolean(searchFilterText);
    const searchCondition = hasSearchText
      ? [
          { accountName: { $ilike: `%${searchFilterText}%` } },
          { website: { $ilike: `%${searchFilterText}%` } },
          { accountDomain: { $ilike: `%${searchFilterText}%` } },
        ]
      : [];

    const hasAccountTypeFilter = Boolean(filterOptions.accountType);
    const hasSegmentFilter = Boolean(filterOptions.segment);
    ifHasHealthStatusFilter: Boolean(filterOptions.healthStatus);
    const hasLifecycleStageFilter = Boolean(filterOptions.lifecycleStage);
    const hasRecordStatusFilter = Boolean(filterOptions.recordStatus);

    const queryFilters = {
      ...(hasSearchText ? { $or: searchCondition } : {}),
      ...(hasAccountTypeFilter ? { accountType: filterOptions.accountType } : {}),
      ...(hasSegmentFilter ? { segment: filterOptions.segment } : {}),
      ...(filterOptions.healthStatus ? { healthStatus: filterOptions.healthStatus } : {}),
      ...(hasLifecycleStageFilter ? { lifecycleStage: filterOptions.lifecycleStage } : {}),
      ...(hasRecordStatusFilter ? { recordStatus: filterOptions.recordStatus } : {}),
    };

    const [accountEntitiesList, totalAccountsCount] = await this.entityManager.findAndCount(
      AccountEntity,
      queryFilters,
      {
        limit: itemsPerPage,
        offset: queryOffset,
        orderBy: { createdAt: 'DESC' },
        populate: ['primaryCsm', 'accountManager'],
      }
    );

    return {
      accounts: toAccountRtoCollection(accountEntitiesList),
      total: totalAccountsCount,
    };
  }

  async updateAccount(accountId: string, updateInputData: UpdateAccountDto): Promise<AccountRto> {
    const existingAccountEntity = await this.entityManager.findOne(AccountEntity, { id: accountId });
    
    const isAccountNotFound = !existingAccountEntity;
    if (isAccountNotFound) {
      throw AppError.notFound(`Account with ID '${accountId}' not found`);
    }

    this.entityManager.assign(existingAccountEntity, updateInputData);
    await this.entityManager.flush();

    return toAccountRto(existingAccountEntity);
  }

  async deleteAccount(accountId: string): Promise<void> {
    const existingAccountEntity = await this.entityManager.findOne(AccountEntity, { id: accountId });
    
    const isAccountNotFound = !existingAccountEntity;
    if (isAccountNotFound) {
      throw AppError.notFound(`Account with ID '${accountId}' not found`);
    }

    await this.entityManager.removeAndFlush(existingAccountEntity);
  }
}
