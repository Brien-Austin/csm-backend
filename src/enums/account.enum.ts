export enum ExternalSource {
  SALESFORCE = 'Salesforce',
  HUBSPOT = 'HubSpot',
  OTHER = 'Other',
}

export enum AccountType {
  CUSTOMER = 'Customer',
  PROSPECT = 'Prospect',
  PARTNER = 'Partner',
  RESELLER = 'Reseller',
  FORMER_CUSTOMER = 'Former Customer',
  TRIAL = 'Trial',
}

export enum Segment {
  ENTERPRISE = 'Enterprise',
  MID_MARKET = 'Mid-Market',
  SMB = 'SMB',
}

export enum CustomerType {
  DIRECT_CUSTOMER = 'Direct Customer',
  PARTNER = 'Partner',
  RESELLER = 'Reseller',
  PROSPECT = 'Prospect',
  FORMER_CUSTOMER = 'Former Customer',
}

export enum LifecycleStage {
  ONBOARDING = 'Onboarding',
  ACTIVE_ADOPTION = 'Active / Adoption',
  RENEWAL = 'Renewal',
  CHURNED = 'Churned',
  REACTIVATION = 'Reactivation',
}

export enum AccountTier {
  TIER_1 = 'Tier 1',
  TIER_2 = 'Tier 2',
  TIER_3 = 'Tier 3',
}

export enum HealthStatus {
  HEALTHY = 'Healthy',
  NEUTRAL = 'Neutral',
  AT_RISK = 'At Risk',
  CRITICAL = 'Critical',
}

export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

export enum RecordStatus {
  ACTIVE = 'Active',
  ARCHIVED = 'Archived',
}

export enum DataSource {
  MANUAL = 'Manual',
  CRM_IMPORT = 'CRM Import',
  MIGRATION = 'Migration',
  API = 'API',
}
