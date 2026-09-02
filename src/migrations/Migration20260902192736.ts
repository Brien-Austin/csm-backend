import { Migration } from '@mikro-orm/migrations';

export class Migration20260902192736 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create schema if not exists "identity";`);
    this.addSql(`create schema if not exists "account";`);
    this.addSql(`create table "identity"."users" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "email" varchar(255) not null, "name" varchar(255) not null, "role" text check ("role" in ('admin', 'user', 'manager', 'csm')) not null default 'user', "is_active" boolean not null default true, constraint "users_pkey" primary key ("id"));`);
    this.addSql(`alter table "identity"."users" add constraint "users_email_unique" unique ("email");`);

    this.addSql(`create table "account"."accounts" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "account_name" varchar(255) not null, "external_account_id" varchar(255) null, "external_source" text check ("external_source" in ('Salesforce', 'HubSpot', 'Other')) null, "account_type" text check ("account_type" in ('Customer', 'Prospect', 'Partner', 'Reseller', 'Former Customer', 'Trial')) not null default 'Prospect', "website" varchar(255) null, "account_domain" varchar(255) null, "hq_country" varchar(255) null, "hq_state" varchar(255) null, "operating_countries" jsonb null, "operating_states" jsonb null, "reporting_region" varchar(255) null, "segment" text check ("segment" in ('Enterprise', 'Mid-Market', 'SMB')) null, "customer_type" text check ("customer_type" in ('Direct Customer', 'Partner', 'Reseller', 'Prospect', 'Former Customer')) null, "lifecycle_stage" text check ("lifecycle_stage" in ('Onboarding', 'Active / Adoption', 'Renewal', 'Churned', 'Reactivation')) not null default 'Onboarding', "account_tier" text check ("account_tier" in ('Tier 1', 'Tier 2', 'Tier 3')) null, "is_strategic" boolean not null default false, "industry" varchar(255) null, "company_size" varchar(255) null, "health_status" text check ("health_status" in ('Healthy', 'Neutral', 'At Risk', 'Critical')) null, "risk_level" text check ("risk_level" in ('Low', 'Medium', 'High', 'Critical')) null, "risk_reasons" jsonb null, "health_notes" text null, "health_score" double precision null, "primary_csm_id" uuid null, "csm_team" varchar(255) null, "account_manager_id" uuid null, "csm_start_date" date null, "contract_start_date" date null, "contract_end_date" date null, "renewal_date" date null, "contract_value_arr" numeric(12,2) null, "billing_currency" varchar(255) null, "plan_tier" varchar(255) null, "primary_customer_goal" text null, "use_cases" jsonb null, "success_criteria" text null, "key_products" jsonb null, "customer_since" date null, "onboarding_start_date" date null, "go_live_date" date null, "last_csm_review_date" timestamptz null, "next_review_date" date null, "created_by_id" uuid null, "updated_by_id" uuid null, "record_status" text check ("record_status" in ('Active', 'Archived')) not null default 'Active', "data_source" text check ("data_source" in ('Manual', 'CRM Import', 'Migration', 'API')) not null default 'Manual', constraint "accounts_pkey" primary key ("id"));`);

    this.addSql(`create table "account"."contacts" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "account_id" uuid not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "email" varchar(255) not null, "phone" varchar(255) null, "title" varchar(255) null, "is_primary" boolean not null default false, constraint "contacts_pkey" primary key ("id"));`);

    this.addSql(`create table "account"."tasks" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "account_id" uuid not null, "contact_id" uuid null, "assigned_to_id" uuid null, "title" varchar(255) not null, "description" text null, "status" text check ("status" in ('Pending', 'In Progress', 'Completed', 'Cancelled')) not null default 'Pending', "priority" text check ("priority" in ('Low', 'Medium', 'High', 'Urgent')) not null default 'Medium', "due_date" timestamptz null, constraint "tasks_pkey" primary key ("id"));`);

    this.addSql(`create table "account"."activities" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "account_id" uuid not null, "contact_id" uuid null, "type" text check ("type" in ('Call', 'Email', 'Meeting', 'Note', 'Review')) not null default 'Note', "subject" varchar(255) not null, "description" text null, "activity_date" timestamptz not null, "performed_by_id" uuid null, constraint "activities_pkey" primary key ("id"));`);

    this.addSql(`alter table "account"."accounts" add constraint "accounts_primary_csm_id_foreign" foreign key ("primary_csm_id") references "identity"."users" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "account"."accounts" add constraint "accounts_account_manager_id_foreign" foreign key ("account_manager_id") references "identity"."users" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "account"."accounts" add constraint "accounts_created_by_id_foreign" foreign key ("created_by_id") references "identity"."users" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "account"."accounts" add constraint "accounts_updated_by_id_foreign" foreign key ("updated_by_id") references "identity"."users" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "account"."contacts" add constraint "contacts_account_id_foreign" foreign key ("account_id") references "account"."accounts" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "account"."tasks" add constraint "tasks_account_id_foreign" foreign key ("account_id") references "account"."accounts" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "account"."tasks" add constraint "tasks_contact_id_foreign" foreign key ("contact_id") references "account"."contacts" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "account"."tasks" add constraint "tasks_assigned_to_id_foreign" foreign key ("assigned_to_id") references "identity"."users" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "account"."activities" add constraint "activities_account_id_foreign" foreign key ("account_id") references "account"."accounts" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "account"."activities" add constraint "activities_contact_id_foreign" foreign key ("contact_id") references "account"."contacts" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "account"."activities" add constraint "activities_performed_by_id_foreign" foreign key ("performed_by_id") references "identity"."users" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "account"."accounts" drop constraint "accounts_primary_csm_id_foreign";`);

    this.addSql(`alter table "account"."accounts" drop constraint "accounts_account_manager_id_foreign";`);

    this.addSql(`alter table "account"."accounts" drop constraint "accounts_created_by_id_foreign";`);

    this.addSql(`alter table "account"."accounts" drop constraint "accounts_updated_by_id_foreign";`);

    this.addSql(`alter table "account"."tasks" drop constraint "tasks_assigned_to_id_foreign";`);

    this.addSql(`alter table "account"."activities" drop constraint "activities_performed_by_id_foreign";`);

    this.addSql(`alter table "account"."contacts" drop constraint "contacts_account_id_foreign";`);

    this.addSql(`alter table "account"."tasks" drop constraint "tasks_account_id_foreign";`);

    this.addSql(`alter table "account"."activities" drop constraint "activities_account_id_foreign";`);

    this.addSql(`alter table "account"."tasks" drop constraint "tasks_contact_id_foreign";`);

    this.addSql(`alter table "account"."activities" drop constraint "activities_contact_id_foreign";`);

    this.addSql(`drop table if exists "identity"."users" cascade;`);

    this.addSql(`drop table if exists "account"."accounts" cascade;`);

    this.addSql(`drop table if exists "account"."contacts" cascade;`);

    this.addSql(`drop table if exists "account"."tasks" cascade;`);

    this.addSql(`drop table if exists "account"."activities" cascade;`);

    this.addSql(`drop schema if exists "identity";`);
    this.addSql(`drop schema if exists "account";`);
  }

}
