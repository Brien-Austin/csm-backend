import { z } from 'zod';
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

export const CreateAccountDtoSchema = z.object({
  // 1. Account Identity
  accountName: z.string().min(1, 'Account name is required'),
  externalAccountId: z.string().optional(),
  externalSource: z.nativeEnum(ExternalSource).optional(),
  accountType: z.nativeEnum(AccountType).optional().default(AccountType.PROSPECT),
  website: z.string().url('Invalid website URL format').optional().or(z.literal('')),
  accountDomain: z.string().optional(),

  // 2. Headquarters and Geography
  hqCountry: z.string().optional(),
  hqState: z.string().optional(),
  operatingCountries: z.array(z.string()).optional(),
  operatingStates: z.array(z.string()).optional(),
  reportingRegion: z.nativeEnum(ReportingRegion).optional(),

  // 3. Customer Classification
  segment: z.nativeEnum(Segment).optional(),
  customerType: z.nativeEnum(CustomerType).optional(),
  lifecycleStage: z.nativeEnum(LifecycleStage).optional().default(LifecycleStage.ONBOARDING),
  accountTier: z.nativeEnum(AccountTier).optional(),
  isStrategic: z.boolean().optional().default(false),
  industry: z.nativeEnum(Industry).optional(),
  companySize: z.nativeEnum(CompanySize).optional(),

  // 4. Health and Risk
  healthStatus: z.nativeEnum(HealthStatus).optional(),
  riskLevel: z.nativeEnum(RiskLevel).optional(),
  // Structured multi-select risk reasons — controlled Data Dictionary values only
  riskReasons: z.array(z.nativeEnum(RiskReason)).optional(),
  healthNotes: z.string().optional(),
  healthScore: z.number().min(0).max(100).optional(),

  // 5. Ownership — reference User records by UUID
  primaryCsmId: z.string().uuid('Primary CSM must be a valid User UUID').optional(),
  csmTeam: z.string().optional(),
  accountManagerId: z.string().uuid('Account Manager must be a valid User UUID').optional(),
  csmStartDate: z.string().date().optional(),

  // 6. Commercial and Contract
  contractStartDate: z.string().date().optional(),
  contractEndDate: z.string().date().optional(),
  renewalDate: z.string().date().optional(),
  // Stored as numeric amount; currency is tracked separately via billingCurrency
  contractValueArr: z.number().nonnegative('Contract value must be a non-negative number').optional(),
  billingCurrency: z.nativeEnum(BillingCurrency).optional(),
  planTier: z.string().optional(),

  // 7. Customer Context
  primaryCustomerGoal: z.string().optional(),
  // Structured multi-select use-case tags — controlled Data Dictionary values only
  useCases: z.array(z.nativeEnum(UseCaseOption)).optional(),
  successCriteria: z.string().optional(),
  // Entity references for Key Products/Modules purchased or in scope
  keyProducts: z.array(z.string()).optional(),

  // 8. Lifecycle and Review Freshness
  customerSince: z.string().date().optional(),
  onboardingStartDate: z.string().date().optional(),
  goLiveDate: z.string().date().optional(),
  // System-managed but accept CSM input; ISO timestamp with timezone
  lastCsmReviewDate: z.string().datetime({ offset: true }).optional(),
  nextReviewDate: z.string().date().optional(),

  // 9. System Metadata — dataSource and recordStatus can be set on creation
  recordStatus: z.nativeEnum(RecordStatus).optional().default(RecordStatus.ACTIVE),
  dataSource: z.nativeEnum(DataSource).optional().default(DataSource.MANUAL),
});

export type CreateAccountDto = z.infer<typeof CreateAccountDtoSchema>;

export const UpdateAccountDtoSchema = CreateAccountDtoSchema.partial();

export type UpdateAccountDto = z.infer<typeof UpdateAccountDtoSchema>;

export const AccountQueryDtoSchema = z.object({
  page: z.string().optional().transform((pageValue) => (pageValue ? parseInt(pageValue, 10) : 1)),
  limit: z.string().optional().transform((limitValue) => (limitValue ? parseInt(limitValue, 10) : 10)),
  search: z.string().optional(),
  // Filterable enum dimensions per Data Dictionary spec
  accountType: z.nativeEnum(AccountType).optional(),
  segment: z.nativeEnum(Segment).optional(),
  healthStatus: z.nativeEnum(HealthStatus).optional(),
  riskLevel: z.nativeEnum(RiskLevel).optional(),
  lifecycleStage: z.nativeEnum(LifecycleStage).optional(),
  accountTier: z.nativeEnum(AccountTier).optional(),
  recordStatus: z.nativeEnum(RecordStatus).optional(),
  // Query params arrive as strings; coerce 'true'/'false' to boolean
  isStrategic: z
    .string()
    .optional()
    .transform((strategicValue) => {
      const isValueProvided = strategicValue !== undefined;
      if (!isValueProvided) return undefined;
      return strategicValue === 'true';
    }),
});

export type AccountQueryDto = z.infer<typeof AccountQueryDtoSchema>;

export const AccountParamDtoSchema = z.object({
  id: z.string().uuid('Invalid Account UUID format'),
});

export type AccountParamDto = z.infer<typeof AccountParamDtoSchema>;
