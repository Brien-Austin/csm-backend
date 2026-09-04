import { Migration } from '@mikro-orm/migrations';

export class Migration20260904162130 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "account"."accounts" alter column "reporting_region" type text using ("reporting_region"::text);`);
    this.addSql(`alter table "account"."accounts" alter column "industry" type text using ("industry"::text);`);
    this.addSql(`alter table "account"."accounts" alter column "company_size" type text using ("company_size"::text);`);
    this.addSql(`alter table "account"."accounts" alter column "billing_currency" type text using ("billing_currency"::text);`);
    this.addSql(`alter table "account"."accounts" add constraint "accounts_reporting_region_check" check("reporting_region" in ('APAC', 'EMEA', 'North America', 'LATAM'));`);
    this.addSql(`alter table "account"."accounts" add constraint "accounts_industry_check" check("industry" in ('SaaS', 'Financial Services', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Professional Services', 'Media', 'Telecom', 'Government', 'Nonprofit', 'Other'));`);
    this.addSql(`alter table "account"."accounts" add constraint "accounts_company_size_check" check("company_size" in ('1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10000+'));`);
    this.addSql(`alter table "account"."accounts" add constraint "accounts_billing_currency_check" check("billing_currency" in ('USD', 'EUR', 'GBP', 'INR'));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "account"."accounts" drop constraint if exists "accounts_reporting_region_check";`);
    this.addSql(`alter table "account"."accounts" drop constraint if exists "accounts_industry_check";`);
    this.addSql(`alter table "account"."accounts" drop constraint if exists "accounts_company_size_check";`);
    this.addSql(`alter table "account"."accounts" drop constraint if exists "accounts_billing_currency_check";`);

    this.addSql(`alter table "account"."accounts" alter column "reporting_region" type varchar(255) using ("reporting_region"::varchar(255));`);
    this.addSql(`alter table "account"."accounts" alter column "industry" type varchar(255) using ("industry"::varchar(255));`);
    this.addSql(`alter table "account"."accounts" alter column "company_size" type varchar(255) using ("company_size"::varchar(255));`);
    this.addSql(`alter table "account"."accounts" alter column "billing_currency" type varchar(255) using ("billing_currency"::varchar(255));`);
  }

}
