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

// Data Dictionary controlled: structured risk reason tags for reporting and automation
export enum RiskReason {
  LOW_ADOPTION = 'Low Adoption',
  SUPPORT_ISSUES = 'Support Issues',
  CHAMPION_LOSS = 'Champion Loss',
  BUDGET_RISK = 'Budget Risk',
  COMPETITION = 'Competition',
  RENEWAL_RISK = 'Renewal Risk',
  RELATIONSHIP_RISK = 'Relationship Risk',
  PRODUCT_GAP = 'Product Gap',
  OTHER = 'Other',
}

// Data Dictionary controlled: primary industry classification for reporting dimension
export enum Industry {
  SAAS = 'SaaS',
  FINANCIAL_SERVICES = 'Financial Services',
  HEALTHCARE = 'Healthcare',
  EDUCATION = 'Education',
  RETAIL = 'Retail',
  MANUFACTURING = 'Manufacturing',
  PROFESSIONAL_SERVICES = 'Professional Services',
  MEDIA = 'Media',
  TELECOM = 'Telecom',
  GOVERNMENT = 'Government',
  NONPROFIT = 'Nonprofit',
  OTHER = 'Other',
}

// Data Dictionary controlled: employee count band ranges to simplify maintenance
export enum CompanySize {
  MICRO = '1-10',
  SMALL = '11-50',
  SMALL_MEDIUM = '51-200',
  MEDIUM = '201-500',
  MEDIUM_LARGE = '501-1000',
  LARGE = '1001-5000',
  VERY_LARGE = '5001-10000',
  ENTERPRISE = '10000+',
}

// ISO 4217 currency codes for billing; prefer standard codes over free text
export enum BillingCurrency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  INR = 'INR',
}

// Higher-level reporting abstraction derived from HQ country; does not replace Country or State
export enum ReportingRegion {
  APAC = 'APAC',
  EMEA = 'EMEA',
  NORTH_AMERICA = 'North America',
  LATAM = 'LATAM',
}

// Data Dictionary controlled: structured use-case tags for what the customer uses the product for
export enum UseCaseOption {
  ANALYTICS = 'Analytics',
  AUTOMATION = 'Automation',
  REPORTING = 'Reporting',
  INTEGRATIONS = 'Integrations',
  COLLABORATION = 'Collaboration',
  COMPLIANCE = 'Compliance',
  ONBOARDING = 'Onboarding',
  SUPPORT = 'Support',
  OTHER = 'Other',
}
