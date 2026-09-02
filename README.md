# Express.js TypeScript Backend - CSM Core Module 1 API

A robust, memory-efficient Express.js backend built with TypeScript, MikroORM (PostgreSQL / Supabase), Sentry error monitoring, Zod validation, DTO/RTO patterns, and Render deployment setup.

---

## 🚀 Module 1 API Endpoints Summary

### 1. Health Check
- `GET /health` - Application and Database connection health probe.

### 2. Accounts API (`/api/v1/accounts`)
- `POST /api/v1/accounts` - Create Account (Identity, HQ/Geography, Classification, Health, Risk, Contract, Context).
- `GET /api/v1/accounts` - List Accounts with pagination, search, and filtering (`?page=1&limit=10&search=acme&accountType=Customer&segment=Enterprise&healthStatus=Healthy`).
- `GET /api/v1/accounts/:id` - Get Account details by UUID.
- `PATCH /api/v1/accounts/:id` - Update Account details.
- `DELETE /api/v1/accounts/:id` - Delete/Archive Account.
- `GET /api/v1/accounts/:accountId/contacts` - List Contacts for an Account.
- `GET /api/v1/accounts/:accountId/activities` - List Activities for an Account.
- `GET /api/v1/accounts/:accountId/tasks` - List Tasks for an Account.

### 3. Contacts API (`/api/v1/contacts`)
- `POST /api/v1/contacts` - Create Contact linked to an Account.
- `GET /api/v1/contacts` - List Contacts (`?accountId=...&search=John`).
- `GET /api/v1/contacts/:id` - Get Contact by UUID.
- `PATCH /api/v1/contacts/:id` - Update Contact details.
- `DELETE /api/v1/contacts/:id` - Delete Contact.

### 4. Activities API (`/api/v1/activities`)
- `POST /api/v1/activities` - Log Activity against an Account (optional Contact & PerformedBy User).
- `GET /api/v1/activities` - List Activities (`?accountId=...&type=Call`).
- `GET /api/v1/activities/:id` - Get Activity details.
- `PATCH /api/v1/activities/:id` - Update Activity.
- `DELETE /api/v1/activities/:id` - Delete Activity.

### 5. Tasks API (`/api/v1/tasks`)
- `POST /api/v1/tasks` - Create Follow-up Task against an Account (optional Contact & Assigned User).
- `GET /api/v1/tasks` - List Tasks (`?accountId=...&status=Pending&priority=High`).
- `GET /api/v1/tasks/:id` - Get Task details.
- `PATCH /api/v1/tasks/:id` - Update Task.
- `DELETE /api/v1/tasks/:id` - Delete Task.

### 6. Users API (`/api/v1/users`)
- `POST /api/v1/users` - Create User.
- `GET /api/v1/users` - List Users.
- `GET /api/v1/users/:id` - Get User.
- `PATCH /api/v1/users/:id` - Update User.
- `DELETE /api/v1/users/:id` - Delete User.

---

## 🛠️ Migration Scripts

Short npm script aliases for MikroORM migrations:
- `npm run m:create` - Create timestamped migration schema diff.
- `npm run m:up` - Apply pending migrations to database.
- `npm run m:down` - Rollback latest migration.
- `npm run m:pending` - List migration status.
