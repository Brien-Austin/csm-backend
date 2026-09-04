import { AccountEntity } from '../entities/account.entity';
import { UserRto, toUserRto } from './user.rto';
import {
  AccountType,
  ExternalSource,
  Segment,
  CustomerType,
  LifecycleStage,
  AccountTier,
  HealthStatus,
  RiskLevel,
  RiskReason,
  Industry,
  CompanySize,
  BillingCurrency,
  ReportingRegion,
  UseCaseOption,
  RecordStatus,
  DataSource,
} from '../enums/account.enum';

export interface AccountRto {
  // 1. Account Identity
  id: string;
  accountName: string;
  externalAccountId?: string;
  externalSource?: ExternalSource;
  accountType: AccountType;
  website?: string;
  accountDomain?: string;

  // 2. Headquarters and Geography
  hqCountry?: string;
  hqState?: string;
  operatingCountries?: string[];
  operatingStates?: string[];
  reportingRegion?: ReportingRegion;

  // 3. Customer Classification
  segment?: Segment;
  customerType?: CustomerType;
  lifecycleStage: LifecycleStage;
  accountTier?: AccountTier;
  isStrategic: boolean;
  industry?: Industry;
  companySize?: CompanySize;

  // 4. Health and Risk
  healthStatus?: HealthStatus;
  riskLevel?: RiskLevel;
  riskReasons?: RiskReason[];
  healthNotes?: string;
  healthScore?: number;

  // 5. Ownership
  primaryCsm?: UserRto;
  csmTeam?: string;
  accountManager?: UserRto;
  csmStartDate?: string;

  // 6. Commercial and Contract
  contractStartDate?: string;
  contractEndDate?: string;
  renewalDate?: string;
  contractValueArr?: number;
  billingCurrency?: BillingCurrency;
  planTier?: string;

  // 7. Customer Context
  primaryCustomerGoal?: string;
  useCases?: UseCaseOption[];
  successCriteria?: string;
  keyProducts?: string[];

  // 8. Lifecycle and Review Freshness
  customerSince?: string;
  onboardingStartDate?: string;
  goLiveDate?: string;
  lastCsmReviewDate?: string;
  nextReviewDate?: string;

  // 9. System Metadata
  createdBy?: UserRto;
  updatedBy?: UserRto;
  recordStatus: RecordStatus;
  dataSource: DataSource;
  createdAt: string;
  updatedAt: string;
}

export function toAccountRto(account: AccountEntity): AccountRto {
  return {
    // 1. Account Identity
    id: account.id,
    accountName: account.accountName,
    externalAccountId: account.externalAccountId,
    externalSource: account.externalSource,
    accountType: account.accountType,
    website: account.website,
    accountDomain: account.accountDomain,

    // 2. Headquarters and Geography
    hqCountry: account.hqCountry,
    hqState: account.hqState,
    operatingCountries: account.operatingCountries,
    operatingStates: account.operatingStates,
    reportingRegion: account.reportingRegion,

    // 3. Customer Classification
    segment: account.segment,
    customerType: account.customerType,
    lifecycleStage: account.lifecycleStage,
    accountTier: account.accountTier,
    isStrategic: account.isStrategic,
    industry: account.industry,
    companySize: account.companySize,

    // 4. Health and Risk
    healthStatus: account.healthStatus,
    riskLevel: account.riskLevel,
    riskReasons: account.riskReasons,
    healthNotes: account.healthNotes,
    healthScore: account.healthScore,

    // 5. Ownership
    primaryCsm: account.primaryCsm ? toUserRto(account.primaryCsm) : undefined,
    csmTeam: account.csmTeam,
    accountManager: account.accountManager ? toUserRto(account.accountManager) : undefined,
    csmStartDate: account.csmStartDate ? account.csmStartDate.toISOString() : undefined,

    // 6. Commercial and Contract
    contractStartDate: account.contractStartDate ? account.contractStartDate.toISOString() : undefined,
    contractEndDate: account.contractEndDate ? account.contractEndDate.toISOString() : undefined,
    renewalDate: account.renewalDate ? account.renewalDate.toISOString() : undefined,
    contractValueArr: account.contractValueArr ? Number(account.contractValueArr) : undefined,
    billingCurrency: account.billingCurrency,
    planTier: account.planTier,

    // 7. Customer Context
    primaryCustomerGoal: account.primaryCustomerGoal,
    useCases: account.useCases,
    successCriteria: account.successCriteria,
    keyProducts: account.keyProducts,

    // 8. Lifecycle and Review Freshness
    customerSince: account.customerSince ? account.customerSince.toISOString() : undefined,
    onboardingStartDate: account.onboardingStartDate ? account.onboardingStartDate.toISOString() : undefined,
    goLiveDate: account.goLiveDate ? account.goLiveDate.toISOString() : undefined,
    lastCsmReviewDate: account.lastCsmReviewDate ? account.lastCsmReviewDate.toISOString() : undefined,
    nextReviewDate: account.nextReviewDate ? account.nextReviewDate.toISOString() : undefined,

    // 9. System Metadata
    createdBy: account.createdBy ? toUserRto(account.createdBy) : undefined,
    updatedBy: account.updatedBy ? toUserRto(account.updatedBy) : undefined,
    recordStatus: account.recordStatus,
    dataSource: account.dataSource,
    createdAt: account.createdAt.toISOString(),
    updatedAt: account.updatedAt.toISOString(),
  };
}

export function toAccountRtoCollection(accounts: AccountEntity[]): AccountRto[] {
  return accounts.map(toAccountRto);
}
