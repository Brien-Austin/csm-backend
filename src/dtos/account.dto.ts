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
  RecordStatus,
  DataSource,
} from '../enums/account.enum';

export const CreateAccountDtoSchema = z.object({
  accountName: z.string().min(1, 'Account name is required'),
  externalAccountId: z.string().optional(),
  externalSource: z.nativeEnum(ExternalSource).optional(),
  accountType: z.nativeEnum(AccountType).optional().default(AccountType.PROSPECT),
  website: z.string().url('Invalid website URL format').optional().or(z.literal('')),
  accountDomain: z.string().optional(),
  hqCountry: z.string().optional(),
  hqState: z.string().optional(),
  operatingCountries: z.array(z.string()).optional(),
  operatingStates: z.array(z.string()).optional(),
  reportingRegion: z.string().optional(),
  segment: z.nativeEnum(Segment).optional(),
  customerType: z.nativeEnum(CustomerType).optional(),
  lifecycleStage: z.nativeEnum(LifecycleStage).optional().default(LifecycleStage.ONBOARDING),
  accountTier: z.nativeEnum(AccountTier).optional(),
  isStrategic: z.boolean().optional().default(false),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  healthStatus: z.nativeEnum(HealthStatus).optional(),
  riskLevel: z.nativeEnum(RiskLevel).optional(),
  riskReasons: z.array(z.string()).optional(),
  healthNotes: z.string().optional(),
  healthScore: z.number().min(0).max(100).optional(),
  primaryCsmId: z.string().uuid().optional(),
  csmTeam: z.string().optional(),
  accountManagerId: z.string().uuid().optional(),
  csmStartDate: z.string().datetime().optional().or(z.string().date().optional()),
  contractStartDate: z.string().datetime().optional().or(z.string().date().optional()),
  contractEndDate: z.string().datetime().optional().or(z.string().date().optional()),
  renewalDate: z.string().datetime().optional().or(z.string().date().optional()),
  contractValueArr: z.number().nonnegative().optional(),
  billingCurrency: z.string().optional(),
  planTier: z.string().optional(),
  primaryCustomerGoal: z.string().optional(),
  useCases: z.array(z.string()).optional(),
  successCriteria: z.string().optional(),
  keyProducts: z.array(z.string()).optional(),
  customerSince: z.string().datetime().optional().or(z.string().date().optional()),
  onboardingStartDate: z.string().datetime().optional().or(z.string().date().optional()),
  goLiveDate: z.string().datetime().optional().or(z.string().date().optional()),
  lastCsmReviewDate: z.string().datetime().optional(),
  nextReviewDate: z.string().datetime().optional().or(z.string().date().optional()),
  recordStatus: z.nativeEnum(RecordStatus).optional().default(RecordStatus.ACTIVE),
  dataSource: z.nativeEnum(DataSource).optional().default(DataSource.MANUAL),
});

export type CreateAccountDto = z.infer<typeof CreateAccountDtoSchema>;

export const UpdateAccountDtoSchema = CreateAccountDtoSchema.partial();

export type UpdateAccountDto = z.infer<typeof UpdateAccountDtoSchema>;

export const AccountQueryDtoSchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional(),
  accountType: z.nativeEnum(AccountType).optional(),
  segment: z.nativeEnum(Segment).optional(),
  healthStatus: z.nativeEnum(HealthStatus).optional(),
  lifecycleStage: z.nativeEnum(LifecycleStage).optional(),
  recordStatus: z.nativeEnum(RecordStatus).optional(),
});

export type AccountQueryDto = z.infer<typeof AccountQueryDtoSchema>;

export const AccountParamDtoSchema = z.object({
  id: z.string().uuid('Invalid Account UUID format'),
});

export type AccountParamDto = z.infer<typeof AccountParamDtoSchema>;
