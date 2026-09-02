import { AccountEntity } from '../entities/account.entity';
import { UserRto, toUserRto } from './user.rto';

export interface AccountRto {
  id: string;
  accountName: string;
  externalAccountId?: string;
  externalSource?: string;
  accountType: string;
  website?: string;
  accountDomain?: string;
  hqCountry?: string;
  hqState?: string;
  operatingCountries?: string[];
  operatingStates?: string[];
  reportingRegion?: string;
  segment?: string;
  customerType?: string;
  lifecycleStage: string;
  accountTier?: string;
  isStrategic: boolean;
  industry?: string;
  companySize?: string;
  healthStatus?: string;
  riskLevel?: string;
  riskReasons?: string[];
  healthNotes?: string;
  healthScore?: number;
  primaryCsm?: UserRto;
  csmTeam?: string;
  accountManager?: UserRto;
  csmStartDate?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  renewalDate?: string;
  contractValueArr?: number;
  billingCurrency?: string;
  planTier?: string;
  primaryCustomerGoal?: string;
  useCases?: string[];
  successCriteria?: string;
  keyProducts?: string[];
  customerSince?: string;
  onboardingStartDate?: string;
  goLiveDate?: string;
  lastCsmReviewDate?: string;
  nextReviewDate?: string;
  createdBy?: UserRto;
  updatedBy?: UserRto;
  recordStatus: string;
  dataSource: string;
  createdAt: string;
  updatedAt: string;
}

export function toAccountRto(account: AccountEntity): AccountRto {
  return {
    id: account.id,
    accountName: account.accountName,
    externalAccountId: account.externalAccountId,
    externalSource: account.externalSource,
    accountType: account.accountType,
    website: account.website,
    accountDomain: account.accountDomain,
    hqCountry: account.hqCountry,
    hqState: account.hqState,
    operatingCountries: account.operatingCountries,
    operatingStates: account.operatingStates,
    reportingRegion: account.reportingRegion,
    segment: account.segment,
    customerType: account.customerType,
    lifecycleStage: account.lifecycleStage,
    accountTier: account.accountTier,
    isStrategic: account.isStrategic,
    industry: account.industry,
    companySize: account.companySize,
    healthStatus: account.healthStatus,
    riskLevel: account.riskLevel,
    riskReasons: account.riskReasons,
    healthNotes: account.healthNotes,
    healthScore: account.healthScore,
    primaryCsm: account.primaryCsm ? toUserRto(account.primaryCsm) : undefined,
    csmTeam: account.csmTeam,
    accountManager: account.accountManager ? toUserRto(account.accountManager) : undefined,
    csmStartDate: account.csmStartDate ? account.csmStartDate.toISOString() : undefined,
    contractStartDate: account.contractStartDate ? account.contractStartDate.toISOString() : undefined,
    contractEndDate: account.contractEndDate ? account.contractEndDate.toISOString() : undefined,
    renewalDate: account.renewalDate ? account.renewalDate.toISOString() : undefined,
    contractValueArr: account.contractValueArr ? Number(account.contractValueArr) : undefined,
    billingCurrency: account.billingCurrency,
    planTier: account.planTier,
    primaryCustomerGoal: account.primaryCustomerGoal,
    useCases: account.useCases,
    successCriteria: account.successCriteria,
    keyProducts: account.keyProducts,
    customerSince: account.customerSince ? account.customerSince.toISOString() : undefined,
    onboardingStartDate: account.onboardingStartDate ? account.onboardingStartDate.toISOString() : undefined,
    goLiveDate: account.goLiveDate ? account.goLiveDate.toISOString() : undefined,
    lastCsmReviewDate: account.lastCsmReviewDate ? account.lastCsmReviewDate.toISOString() : undefined,
    nextReviewDate: account.nextReviewDate ? account.nextReviewDate.toISOString() : undefined,
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
