import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import {
  ExternalSource,
  AccountType,
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

@Entity({ schema: 'account', tableName: 'accounts' })
export class AccountEntity extends BaseEntity {
  // 1. Account Identity
  @Property({ type: 'string' })
  accountName!: string;

  @Property({ type: 'string', nullable: true })
  externalAccountId?: string;

  @Enum({ items: () => ExternalSource, nullable: true })
  externalSource?: ExternalSource;

  @Enum({ items: () => AccountType, default: AccountType.PROSPECT })
  accountType: AccountType = AccountType.PROSPECT;

  @Property({ type: 'string', nullable: true })
  website?: string;

  @Property({ type: 'string', nullable: true })
  accountDomain?: string;

  // 2. Headquarters and Geography
  // Important: HQ geography (headquarters location) is separate from Operating geography (user footprint)
  // and Reporting Region (reporting abstraction). Do not collapse these into a single field.
  @Property({ type: 'string', nullable: true })
  hqCountry?: string;

  @Property({ type: 'string', nullable: true })
  hqState?: string;

  @Property({ type: 'json', nullable: true })
  operatingCountries?: string[];

  @Property({ type: 'json', nullable: true })
  operatingStates?: string[];

  // Derived higher-level reporting geography; does not replace hqCountry or hqState
  @Enum({ items: () => ReportingRegion, nullable: true })
  reportingRegion?: ReportingRegion;

  // 3. Customer Classification
  @Enum({ items: () => Segment, nullable: true })
  segment?: Segment;

  @Enum({ items: () => CustomerType, nullable: true })
  customerType?: CustomerType;

  @Enum({ items: () => LifecycleStage, default: LifecycleStage.ONBOARDING })
  lifecycleStage: LifecycleStage = LifecycleStage.ONBOARDING;

  @Enum({ items: () => AccountTier, nullable: true })
  accountTier?: AccountTier;

  // High-touch strategic treatment flag; simple binary classification
  @Property({ type: 'boolean', default: false })
  isStrategic: boolean = false;

  @Enum({ items: () => Industry, nullable: true })
  industry?: Industry;

  // Employee count stored as a band/range to simplify maintenance and reduce churn
  @Enum({ items: () => CompanySize, nullable: true })
  companySize?: CompanySize;

  // 4. Health and Risk
  // Health Status and Risk Level are independent current-state values on the Account
  @Enum({ items: () => HealthStatus, nullable: true })
  healthStatus?: HealthStatus;

  @Enum({ items: () => RiskLevel, nullable: true })
  riskLevel?: RiskLevel;

  // Structured multi-select risk reasons stored as JSONB for reporting and automation
  @Property({ type: 'json', nullable: true })
  riskReasons?: RiskReason[];

  @Property({ type: 'text', nullable: true })
  healthNotes?: string;

  // Numerical health score (0-100); do not populate before an agreed scoring model exists
  @Property({ type: 'double', nullable: true })
  healthScore?: number;

  // 5. Ownership
  @ManyToOne(() => UserEntity, { nullable: true })
  primaryCsm?: UserEntity;

  @Property({ type: 'string', nullable: true })
  csmTeam?: string;

  @ManyToOne(() => UserEntity, { nullable: true })
  accountManager?: UserEntity;

  @Property({ type: 'date', nullable: true })
  csmStartDate?: Date;

  // 6. Commercial and Contract
  @Property({ type: 'date', nullable: true })
  contractStartDate?: Date;

  @Property({ type: 'date', nullable: true })
  contractEndDate?: Date;

  // Renewal date may differ from contractEndDate; used for renewal planning workflows
  @Property({ type: 'date', nullable: true })
  renewalDate?: Date;

  // Stored as numeric decimal with explicit currency — not free text
  @Property({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  contractValueArr?: number;

  @Enum({ items: () => BillingCurrency, nullable: true })
  billingCurrency?: BillingCurrency;

  @Property({ type: 'string', nullable: true })
  planTier?: string;

  // 7. Customer Context
  @Property({ type: 'text', nullable: true })
  primaryCustomerGoal?: string;

  // Structured multi-select use-case tags stored as JSONB; controlled values preferred over free text
  @Property({ type: 'json', nullable: true })
  useCases?: UseCaseOption[];

  @Property({ type: 'text', nullable: true })
  successCriteria?: string;

  // Entity references to Key Products/Modules purchased or in scope — stored as ID array
  @Property({ type: 'json', nullable: true })
  keyProducts?: string[];

  // 8. Lifecycle and Review Freshness
  @Property({ type: 'date', nullable: true })
  customerSince?: Date;

  @Property({ type: 'date', nullable: true })
  onboardingStartDate?: Date;

  @Property({ type: 'date', nullable: true })
  goLiveDate?: Date;

  // System-managed timestamp; used to detect stale health/risk data
  @Property({ type: 'datetime', nullable: true })
  lastCsmReviewDate?: Date;

  @Property({ type: 'date', nullable: true })
  nextReviewDate?: Date;

  // 9. System Metadata
  @ManyToOne(() => UserEntity, { nullable: true })
  createdBy?: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: true })
  updatedBy?: UserEntity;

  // Prefer archive over hard delete to preserve historical customer context
  @Enum({ items: () => RecordStatus, default: RecordStatus.ACTIVE })
  recordStatus: RecordStatus = RecordStatus.ACTIVE;

  @Enum({ items: () => DataSource, default: DataSource.MANUAL })
  dataSource: DataSource = DataSource.MANUAL;

  constructor({
    accountName,
    externalAccountId,
    externalSource,
    accountType = AccountType.PROSPECT,
    website,
    accountDomain,
    hqCountry,
    hqState,
    operatingCountries,
    operatingStates,
    reportingRegion,
    segment,
    customerType,
    lifecycleStage = LifecycleStage.ONBOARDING,
    accountTier,
    isStrategic = false,
    industry,
    companySize,
    healthStatus,
    riskLevel,
    riskReasons,
    healthNotes,
    healthScore,
    primaryCsm,
    csmTeam,
    accountManager,
    csmStartDate,
    contractStartDate,
    contractEndDate,
    renewalDate,
    contractValueArr,
    billingCurrency,
    planTier,
    primaryCustomerGoal,
    useCases,
    successCriteria,
    keyProducts,
    customerSince,
    onboardingStartDate,
    goLiveDate,
    lastCsmReviewDate,
    nextReviewDate,
    createdBy,
    updatedBy,
    recordStatus = RecordStatus.ACTIVE,
    dataSource = DataSource.MANUAL,
  }: {
    accountName: string;
    externalAccountId?: string;
    externalSource?: ExternalSource;
    accountType?: AccountType;
    website?: string;
    accountDomain?: string;
    hqCountry?: string;
    hqState?: string;
    operatingCountries?: string[];
    operatingStates?: string[];
    reportingRegion?: ReportingRegion;
    segment?: Segment;
    customerType?: CustomerType;
    lifecycleStage?: LifecycleStage;
    accountTier?: AccountTier;
    isStrategic?: boolean;
    industry?: Industry;
    companySize?: CompanySize;
    healthStatus?: HealthStatus;
    riskLevel?: RiskLevel;
    riskReasons?: RiskReason[];
    healthNotes?: string;
    healthScore?: number;
    primaryCsm?: UserEntity;
    csmTeam?: string;
    accountManager?: UserEntity;
    csmStartDate?: Date;
    contractStartDate?: Date;
    contractEndDate?: Date;
    renewalDate?: Date;
    contractValueArr?: number;
    billingCurrency?: BillingCurrency;
    planTier?: string;
    primaryCustomerGoal?: string;
    useCases?: UseCaseOption[];
    successCriteria?: string;
    keyProducts?: string[];
    customerSince?: Date;
    onboardingStartDate?: Date;
    goLiveDate?: Date;
    lastCsmReviewDate?: Date;
    nextReviewDate?: Date;
    createdBy?: UserEntity;
    updatedBy?: UserEntity;
    recordStatus?: RecordStatus;
    dataSource?: DataSource;
  }) {
    super();
    this.accountName = accountName;
    this.externalAccountId = externalAccountId;
    this.externalSource = externalSource;
    this.accountType = accountType;
    this.website = website;
    this.accountDomain = accountDomain;
    this.hqCountry = hqCountry;
    this.hqState = hqState;
    this.operatingCountries = operatingCountries;
    this.operatingStates = operatingStates;
    this.reportingRegion = reportingRegion;
    this.segment = segment;
    this.customerType = customerType;
    this.lifecycleStage = lifecycleStage;
    this.accountTier = accountTier;
    this.isStrategic = isStrategic;
    this.industry = industry;
    this.companySize = companySize;
    this.healthStatus = healthStatus;
    this.riskLevel = riskLevel;
    this.riskReasons = riskReasons;
    this.healthNotes = healthNotes;
    this.healthScore = healthScore;
    this.primaryCsm = primaryCsm;
    this.csmTeam = csmTeam;
    this.accountManager = accountManager;
    this.csmStartDate = csmStartDate;
    this.contractStartDate = contractStartDate;
    this.contractEndDate = contractEndDate;
    this.renewalDate = renewalDate;
    this.contractValueArr = contractValueArr;
    this.billingCurrency = billingCurrency;
    this.planTier = planTier;
    this.primaryCustomerGoal = primaryCustomerGoal;
    this.useCases = useCases;
    this.successCriteria = successCriteria;
    this.keyProducts = keyProducts;
    this.customerSince = customerSince;
    this.onboardingStartDate = onboardingStartDate;
    this.goLiveDate = goLiveDate;
    this.lastCsmReviewDate = lastCsmReviewDate;
    this.nextReviewDate = nextReviewDate;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
    this.recordStatus = recordStatus;
    this.dataSource = dataSource;
  }
}
