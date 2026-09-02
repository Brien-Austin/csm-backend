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
  @Property({ type: 'string', nullable: true })
  hqCountry?: string;

  @Property({ type: 'string', nullable: true })
  hqState?: string;

  @Property({ type: 'json', nullable: true })
  operatingCountries?: string[];

  @Property({ type: 'json', nullable: true })
  operatingStates?: string[];

  @Property({ type: 'string', nullable: true })
  reportingRegion?: string;

  // 3. Customer Classification
  @Enum({ items: () => Segment, nullable: true })
  segment?: Segment;

  @Enum({ items: () => CustomerType, nullable: true })
  customerType?: CustomerType;

  @Enum({ items: () => LifecycleStage, default: LifecycleStage.ONBOARDING })
  lifecycleStage: LifecycleStage = LifecycleStage.ONBOARDING;

  @Enum({ items: () => AccountTier, nullable: true })
  accountTier?: AccountTier;

  @Property({ type: 'boolean', default: false })
  isStrategic: boolean = false;

  @Property({ type: 'string', nullable: true })
  industry?: string;

  @Property({ type: 'string', nullable: true })
  companySize?: string;

  // 4. Health and Risk
  @Enum({ items: () => HealthStatus, nullable: true })
  healthStatus?: HealthStatus;

  @Enum({ items: () => RiskLevel, nullable: true })
  riskLevel?: RiskLevel;

  @Property({ type: 'json', nullable: true })
  riskReasons?: string[];

  @Property({ type: 'text', nullable: true })
  healthNotes?: string;

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

  @Property({ type: 'date', nullable: true })
  renewalDate?: Date;

  @Property({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  contractValueArr?: number;

  @Property({ type: 'string', nullable: true })
  billingCurrency?: string;

  @Property({ type: 'string', nullable: true })
  planTier?: string;

  // 7. Customer Context
  @Property({ type: 'text', nullable: true })
  primaryCustomerGoal?: string;

  @Property({ type: 'json', nullable: true })
  useCases?: string[];

  @Property({ type: 'text', nullable: true })
  successCriteria?: string;

  @Property({ type: 'json', nullable: true })
  keyProducts?: string[];

  // 8. Lifecycle and Review Freshness
  @Property({ type: 'date', nullable: true })
  customerSince?: Date;

  @Property({ type: 'date', nullable: true })
  onboardingStartDate?: Date;

  @Property({ type: 'date', nullable: true })
  goLiveDate?: Date;

  @Property({ type: 'datetime', nullable: true })
  lastCsmReviewDate?: Date;

  @Property({ type: 'date', nullable: true })
  nextReviewDate?: Date;

  // 9. System Metadata
  @ManyToOne(() => UserEntity, { nullable: true })
  createdBy?: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: true })
  updatedBy?: UserEntity;

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
    reportingRegion?: string;
    segment?: Segment;
    customerType?: CustomerType;
    lifecycleStage?: LifecycleStage;
    accountTier?: AccountTier;
    isStrategic?: boolean;
    industry?: string;
    companySize?: string;
    healthStatus?: HealthStatus;
    riskLevel?: RiskLevel;
    riskReasons?: string[];
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
    billingCurrency?: string;
    planTier?: string;
    primaryCustomerGoal?: string;
    useCases?: string[];
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
