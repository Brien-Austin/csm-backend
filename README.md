# Express.js TypeScript Backend with MikroORM, Sentry, & Render

A robust, memory-efficient Express.js backend built with TypeScript, MikroORM (PostgreSQL / Supabase), Sentry error monitoring, Zod validation, DTO/RTO patterns, and Render deployment setup.

## 🚀 Features

- **Express.js + TypeScript**: Strict mode configuration with ES2022 output.
- **MikroORM & PostgreSQL**: Native support for Supabase database (pooling and SSL ready).
- **Automated Database Migrations**: CLI support for creating and running migrations (`npm run migration:create`, `npm run migration:up`).
- **Clean Layered Architecture**:
  - **Controllers**: Handle HTTP input validation and response formatting.
  - **Services**: Pure business logic operating on DTO inputs and returning entity/RTO outputs.
  - **Middlewares**: Centralized error handling, request logging, and MikroORM request scope management.
  - **Types / DTOs / RTOs**: Defined strictly *outside* service files in `src/dtos/` and `src/rtos/`.
- **Sentry Integration**: Global exception capture and error logging.
- **Memory Efficiency**:
  - `RequestContext` middleware guarantees per-request entity manager isolation to prevent memory retention.
  - Graceful process termination (`SIGTERM`/`SIGINT`) releasing DB pool connections properly.
- **Render Ready**: `render.yaml` blueprint included for instant Render deployment.

---

## 📁 Repository Structure

```
.
├── .env.example                  # Environment variables template
├── render.yaml                   # Render deployment configuration
├── package.json                  # Dependencies & npm scripts
├── tsconfig.json                 # TypeScript compiler configuration
├── mikro-orm.config.ts           # Root MikroORM configuration
└── src/
    ├── app.ts                    # Express application builder
    ├── index.ts                  # Application entry point & graceful shutdown
    ├── config/                   # Configuration loaders (env, mikro-orm, sentry)
    ├── controllers/              # HTTP Route Controllers
    ├── dtos/                     # Data Transfer Objects (Zod schemas & TS types)
    ├── entities/                 # MikroORM Database Entities
    ├── middlewares/              # Express Middlewares (RequestContext, Sentry Error, Validation)
    ├── migrations/               # Database Migrations
    ├── routes/                   # API Routes (Health, Users)
    ├── rtos/                     # Response Transfer Objects & Serializers
    ├── services/                 # Pure Business Logic Services
    ├── types/                    # Common app & Express types
    └── utils/                    # AppError, Logger, & Helper utilities
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- **Node.js**: `>= 20.0.0`
- **npm** or **pnpm** / **yarn**
- **PostgreSQL** instance (e.g. Supabase DB or local Postgres)

### 2. Environment Setup

Copy `.env.example` to `.env` and fill in your database credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=4000
NODE_ENV=development

# PostgreSQL / Supabase Credentials
DB_HOST=aws-0-us-east-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.your_supabase_project_ref
DB_PASSWORD=your_supabase_database_password
DB_SSL=true

# Sentry DSN (Optional)
SENTRY_DSN=https://your_sentry_dsn@sentry.io/project
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Database Migrations

Migrations are automatically generated with timestamp prefixes by comparing your MikroORM Entities with the database schema snapshot.

```bash
# Auto-generate a timestamped migration based on entity changes
npm run migration:create

# Run pending migrations
npm run migration:up

# Rollback latest migration
npm run migration:down

# List migration status
npm run migration:list
```

### 5. Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:4000`. Test the health check endpoint:
```bash
curl http://localhost:4000/health
```

---

## 📡 API Endpoints

### Health Check
- `GET /health` - Checks application uptime and DB connection.

### User Management (`/api/v1/users`)
- `POST /api/v1/users` - Create user
  - Body DTO: `{ "email": "user@example.com", "name": "John Doe", "role": "user" }`
- `GET /api/v1/users` - List users with pagination (`?page=1&limit=10&search=john`)
- `GET /api/v1/users/:id` - Get user by UUID
- `PATCH /api/v1/users/:id` - Update user details
- `DELETE /api/v1/users/:id` - Remove user

---

## 📦 Production Build & Render Deployment

### Build Locally
```bash
npm run build
npm start
```

### Deploy to Render
1. Connect your repository to **Render**.
2. Render will automatically detect `render.yaml`.
3. Fill in your environment variables (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `SENTRY_DSN`, etc.) in the Render dashboard.
