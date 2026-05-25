# BlackHR

Salary management system for an organization with 10,000+ employees. HR managers can manage employee records, filter and search the workforce, and view salary analytics on a dashboard.

Built as a **pnpm + Turborepo monorepo** with a NestJS API, React frontend, and shared TypeScript contracts.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Run with Docker](#run-with-docker)
- [Development](#development)
- [Database and seeding](#database-and-seeding)
- [API reference](#api-reference)
- [Architecture overview](#architecture-overview)
- [Documentation](#documentation)
- [Testing](#testing)
- [Performance notes](#performance-notes)
- [Deployment](#deployment)
- [Demo video](#demo-video)
- [Known limitations](#known-limitations)

---

## Features

- **Employee management** — create, list (paginated), update, and delete employees
- **Search and filters** — search by name/email; filter by country, department, and job title; sort columns
- **Salary insights** — country-level and job-title-level salary metrics
- **Dashboard** — salary distribution, department breakdown, country comparison
- **Deterministic seed** — generates 10,000 employees in batches for local development and demos

---

## Tech stack


| Layer            | Technology                                                              |
| ---------------- | ----------------------------------------------------------------------- |
| Monorepo         | pnpm workspaces, Turborepo                                              |
| Frontend         | React 19, Vite, Tailwind CSS, Tremor, React Query, React Hook Form, Zod |
| Backend          | NestJS 11, class-validator, Swagger                                     |
| Database         | SQLite (via Prisma 7 + better-sqlite3)                                  |
| Shared contracts | `@blackhr/shared-types` (API types + shared domain constants)         |
| Testing          | Jest (API), Vitest + Testing Library (web)                              |


---

## Project structure

```txt
blackhr/
├── apps/
│   ├── api/                         # NestJS backend (@blackhr/api)
│   │   ├── prisma/
│   │   │   ├── schema.prisma        # Employee model + indexes
│   │   │   ├── migrations/          # SQL migrations
│   │   │   └── seed/                # Deterministic 10k employee seed
│   │   └── src/
│   │       ├── modules/
│   │       │   ├── employees/       # CRUD module
│   │       │   └── salary-insights/ # Analytics module
│   │       └── database/            # Prisma service
│   └── web/                         # React frontend (@blackhr/web)
│       └── src/
│           ├── modules/
│           │   ├── employees/       # views, controllers, hooks, models
│           │   └── dashboard/
│           ├── shared/              # API client, UI primitives, providers, UI-only option wrappers
│           └── routes/
├── packages/
│   ├── shared-types/                # API contract + workforce constants (FE + BE)
│   ├── eslint-config/
│   ├── prettier-config/
│   └── ts-config/
├── docs/                            # Architecture, testing, performance, OpenAPI
│   ├── architecture/                # overview, tradeoffs, FE/BE architecture
│   ├── performance/                 # seed strategy
│   └── testing/                     # testing strategy
├── AGENTS.md                        # AI / contributor guidelines
├── package.json                     # Root scripts (turbo orchestration)
├── pnpm-workspace.yaml
└── turbo.json
```

---

## Prerequisites

- **Node.js** >= 22.18.0
- **pnpm** 9.x (the repo pins `pnpm@9.15.4` via `packageManager`)

Enable pnpm if needed:

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
```

---

## Getting started

### 1. Install dependencies

From the repo root:

```bash
pnpm install
```

### 2. Configure the API environment

Copy the example env file and set values:

```bash
cp apps/api/.env.example apps/api/.env
```

Recommended local values:

```env
DATABASE_URL="file:./dev.db"
PORT=3001
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173
```

`CORS_ORIGINS` accepts comma-separated origins. Trailing slashes are stripped. Wildcards such as `https://*.vercel.app` are supported for Vercel preview deploys.

### 3. Run database migrations

```bash
pnpm -F @blackhr/api exec prisma migrate dev
```

### 4. Seed the database

Generates 10,000 employees deterministically:

```bash
pnpm -F @blackhr/api exec prisma db seed
```

The seed clears existing employees first, then inserts in batches of 1,000 via `createMany`.

### 5. Start development servers

From the repo root:

```bash
pnpm dev
```

This starts both apps in parallel via Turborepo:


| App        | URL                                                              | Default port |
| ---------- | ---------------------------------------------------------------- | ------------ |
| Web        | [http://localhost:5173](http://localhost:5173)                   | 5173         |
| API        | [http://localhost:3001/api/v1](http://localhost:3001/api/v1)     | 3001         |
| Swagger UI | [http://localhost:3001/api/docs](http://localhost:3001/api/docs) | —            |


The frontend calls the API at `http://localhost:3001/api/v1` by default. Override with a Vite env var if needed:

```env
# apps/web/.env (optional)
VITE_API_URL=http://localhost:3001/api/v1
```

---

## Run with Docker

Production-like setup with multi-stage builds. SQLite persists in `./data/` via a mounted volume — no separate database container.

### Build and start

From the repo root:

```bash
docker compose up --build
```

| Service | URL | Default port |
| --- | --- | --- |
| Web (nginx) | [http://localhost:8080](http://localhost:8080) | 8080 |
| API | [http://localhost:3001/api/v1](http://localhost:3001/api/v1) | 3001 |
| Swagger | [http://localhost:3001/api/docs](http://localhost:3001/api/docs) | — |

### Environment variables

Optional overrides in `.env` at repo root or inline:

```bash
PORT=3001
WEB_PORT=8080
CORS_ORIGINS=http://localhost:8080
VITE_API_URL=http://localhost:3001/api/v1
```

The API container runs `prisma migrate deploy`, seeds the database when empty (`scripts/ensure-seeded.cjs`), then starts the Nest app. Database file: `./data/database.db`.

### Seed in Docker

Docker Compose auto-seeds on first startup when the employee table is empty (same as the production Docker image).

To re-seed manually from the host (requires local pnpm install):

```bash
DATABASE_URL="file:./data/database.db" pnpm -F @blackhr/api exec prisma db seed
```

Or exec into the API container:

```bash
docker compose exec api node prisma/seed/dist/seed.js
```

### Verify health

```bash
curl http://localhost:3001/api/v1/health
# {"status":"ok"}
```

---

## Development

### Root scripts


| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `pnpm dev`        | Start API + web in watch mode      |
| `pnpm build`      | Build all packages and apps        |
| `pnpm lint`       | Lint and type-check all workspaces |
| `pnpm lint:fix`   | Auto-fix lint issues               |
| `pnpm test`       | Run all tests                      |
| `pnpm test:watch` | Run tests in watch mode            |
| `pnpm format`     | Format with Prettier               |


### App-specific commands

```bash
# API only
pnpm -F @blackhr/api dev
pnpm -F @blackhr/api test

# Web only
pnpm -F @blackhr/web dev
pnpm -F @blackhr/web test

# Regenerate OpenAPI spec
pnpm -F @blackhr/api swagger:generate
```

Output is written to `docs/openapi.json`.

---

## Database and seeding

### Schema

The `Employee` model lives in `apps/api/prisma/schema.prisma`:

- Required fields: `id`, `employeeId`, `fullName`, `email`, `jobTitle`, `department`, `country`, `salary`, `employmentType`, `joiningDate`
- Unique constraints: `employeeId`, `email`
- Indexes: `country`, `jobTitle`, `(country, jobTitle)` — used by filters and salary aggregations

### Seed system


| File                                         | Purpose                                     |
| -------------------------------------------- | ------------------------------------------- |
| `apps/api/prisma/seed/seed.ts`               | Orchestrates delete + batched insert        |
| `apps/api/prisma/seed/employee-generator.ts` | Builds deterministic employee rows          |
| `apps/api/prisma/seed/constants.ts`          | Seed tuning (batch size, salary ranges); domain lists from shared-types |
| `apps/api/assets/first_names.txt`            | Name source for generation                  |
| `apps/api/assets/last_names.txt`             | Name source for generation                  |


Seed data is **deterministic** (same output every run) so tests, demos, and analytics stay stable. Re-running the seed is safe — it deletes all rows first.

---

## API reference

Base path: `/api/v1`

### Health

```
GET /api/v1/health
```

### Employees

```
GET    /api/v1/employees              # Paginated list with filters
GET    /api/v1/employees/:id          # Single employee
POST   /api/v1/employees              # Create
PATCH  /api/v1/employees/:id          # Update
DELETE /api/v1/employees/:id          # Delete
```

**Query parameters** (list):


| Param        | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| `page`       | Page number (default: 1)                                                |
| `limit`      | Page size (default: 20, max: 100)                                       |
| `search`     | Matches `fullName` or `email`                                           |
| `country`    | Exact country filter                                                    |
| `department` | Exact department filter                                                 |
| `jobTitle`   | Exact job title filter                                                  |
| `sortBy`     | `fullName`, `salary`, `country`, `jobTitle`, `createdAt`, `joiningDate` |
| `sortOrder`  | `asc` or `desc`                                                         |


### Salary insights

```
GET /api/v1/salary-insights/dashboard
GET /api/v1/salary-insights/country/:country
GET /api/v1/salary-insights/job-title?country=&jobTitle=
```

Interactive docs: **[http://localhost:3001/api/docs](http://localhost:3001/api/docs)**

---

## Architecture overview

### Backend: Controller → Service → Repository → Prisma

```
HTTP Request
  → Controller     routing, Swagger, delegates to service
  → Service        business rules (validation, conflicts, pagination)
  → Repository     query composition, Prisma calls
  → Prisma         ORM
  → SQLite
```

**Key files (employee module):**

- `apps/api/src/modules/employees/controllers/employees.controller.ts`
- `apps/api/src/modules/employees/services/employees.service.ts`
- `apps/api/src/modules/employees/repositories/employees.repository.ts`
- `apps/api/src/modules/employees/dto/` — request validation (class-validator)

Controllers stay thin. Business logic lives in services. Prisma never appears in controllers.

Services depend on a **repository port** (`EmployeesRepositoryPort`) injected via a Symbol token, which makes unit tests fast — repositories are mocked, not the database.

Global request validation runs through Nest's `ValidationPipe` in `apps/api/src/main.ts` (`whitelist`, `transform`, `forbidNonWhitelisted`).

### Frontend: View → Controller → Hook → Model → API

```
View (JSX)           renders props, fires callbacks — no API calls
  → Controller       UI state, debounce, dialog orchestration
    → Hook           React Query (useQuery / useMutation)
      → Model        typed axios methods
        → api.ts     shared axios instance
          → Backend
```

**Key files (employee module):**

- `apps/web/src/modules/employees/views/employees-page.tsx`
- `apps/web/src/modules/employees/controllers/useEmployeesPageController.ts`
- `apps/web/src/modules/employees/hooks/useEmployees.ts`
- `apps/web/src/modules/employees/models/employee.api.ts`
- `apps/web/src/shared/services/api.ts`

Views are intentionally dumb. Controllers own page-level state (search debounce, pagination, modals). Hooks own server-state caching. Models own HTTP paths and types.

### Shared contracts

`@blackhr/shared-types` is the single source of truth for cross-app contracts and reference data:

| Module | Path | Contents |
|---|---|---|
| API shapes | `packages/shared-types/src/index.ts` | `Employee`, `EmployeeQuery`, `CreateEmployeeRequest`, `PaginatedResponse<T>`, `DashboardMetrics`, insight types |
| Workforce options | `packages/shared-types/src/index.ts` | `COUNTRY_OPTIONS`, `DEPARTMENT_OPTIONS`, `JOB_TITLE_OPTIONS`, `EMPLOYMENT_TYPES` |
| Query options | `packages/shared-types/src/index.ts` | `EMPLOYEE_SORT_BY_FIELDS`, `EMPLOYEE_SORT_ORDERS` |

Both apps import via `"@blackhr/shared-types": "workspace:^"`. The package exports runtime values (not types-only) so dropdowns, seed data, and DTO validation stay aligned.

**Web UI wrappers** — `apps/web/src/shared/constants/workforce-options.ts` re-exports shared workforce constants and adds UI-only helpers (`FILTER_*` empty “All” option, `FORM_*` aliases). Do not duplicate domain lists in the web app.

**Seed-only config** — `apps/api/prisma/seed/constants.ts` imports domain lists from shared-types and keeps seed-specific maps (`SALARY_RANGES`, `JOB_TITLE_DEPARTMENTS`, batch sizes).

**Why not share Nest DTOs with the frontend?** Backend DTOs carry Nest decorators (`@IsEmail`, `@ApiProperty`) that the frontend should not depend on. Frontend form validation uses Zod separately (`apps/web/src/modules/employees/types/index.ts`), deriving enums from shared constants where possible.

**Why not share Prisma models?** Prisma types are backend-generated, use `Date` objects, and leak persistence concerns. The HTTP contract uses ISO date strings.

### Salary insights

Aggregations run in the database layer — not in JavaScript:

- Prisma `aggregate` and `groupBy` for min/max/avg/count
- Raw SQL for median salary and salary histogram buckets

See `apps/api/src/modules/salary-insights/repositories/salary-insights.repository.ts`.

For full architecture reasoning, see [docs/architecture/overview.md](docs/architecture/overview.md).

---

## Documentation

Engineering docs for reviewers — focused on **why**, not generic descriptions:

```txt
docs/
├── architecture/
│   ├── overview.md              # Monorepo, request flows, shared contracts
│   ├── frontend-architecture.md # MVC layers, dependency rules
│   ├── backend-architecture.md  # Nest, repository pattern, DTOs
│   └── tradeoffs.md             # SQLite, no auth, React Query vs Redux
├── performance/
│   └── seed-strategy.md         # createMany batching, determinism
└── testing/
    └── testing-strategy.md      # Mock boundaries, behavior tests
```

See also [docs/testing/testing-strategy.md](docs/testing/testing-strategy.md) for the full testing approach.

---

## Testing

### Philosophy

Prioritize behavior over snapshots:

1. Service / business logic tests
2. Seed and generator tests
3. Controller wiring tests
4. Frontend hooks, controllers, and page flows

Avoid trivial component tests and snapshot-heavy suites.

### Run tests

```bash
# All workspaces
pnpm test

# API only
pnpm -F @blackhr/api test

# Web only
pnpm -F @blackhr/web test
```

### Backend pattern

Services are tested with **mocked repository ports** — no database required:

```
apps/api/test/modules/employees/services/employees.service.spec.ts
```

### Frontend pattern

Hooks and pages are tested with a **mocked axios adapter** — real React Query, real hooks, no MSW:

```
apps/web/test/modules/employees/__tests__/hooks/useEmployeeHooks.test.ts
apps/web/test/modules/employees/employees-page.test.tsx
```

---

## Performance notes

Design choices for 10,000+ employees:


| Mechanism                            | Where                                                                       |
| ------------------------------------ | --------------------------------------------------------------------------- |
| Server-side pagination               | `EmployeesService.findAll` caps limit at 100; repository uses `skip`/`take` |
| Server-side filtering                | Repository `buildWhere` — filters never applied client-side on full dataset |
| Search debouncing (300ms)            | `useEmployeesPageController`                                                |
| React Query caching (30s stale time) | `QueryProvider`                                                             |
| Bulk seed inserts                    | `createMany` in batches of 1,000                                            |
| DB indexes                           | `country`, `jobTitle`, `(country, jobTitle)`                                |
| SQL aggregations                     | Salary insights repository                                                  |


### What would strain at 100k+

- SQLite single-writer limits
- `contains` search without full-text indexing (full table scans)
- Offset pagination on deep pages
- Dashboard country chart firing 6 separate API requests

See [docs/performance/seed-strategy.md](docs/performance/seed-strategy.md) and `AGENTS.md` for full performance notes.

---

## Deployment

Suggested targets:

| Component | Target | Notes |
| --- | --- | --- |
| Frontend | [Vercel](https://vercel.com) | Static build from `apps/web`; set `VITE_API_URL` at build time |
| Backend | [Render](https://render.com) or [Railway](https://railway.app) | Docker image from `apps/api/Dockerfile` |
| Database | SQLite in container | Ephemeral on Render free tier; auto-seeds on empty DB at startup |

### Render (backend)

Create a **Web Service** with:

| Setting | Value |
| --- | --- |
| Language | Docker |
| Docker build context | `.` (repo root) |
| Dockerfile path | `apps/api/Dockerfile` |
| Health check path | `/api/v1/health` |

**Environment variables:**

```env
NODE_ENV=production
DATABASE_URL=file:./data/database.db
CORS_ORIGINS=https://*.vercel.app
```

Notes:

- Do **not** set `PORT` — Render injects it automatically.
- `CORS_ORIGINS` is comma-separated. Trailing slashes are stripped automatically.
- Use `https://*.vercel.app` so Vercel preview deploys work without updating CORS on every build.
- For a single stable origin, use the exact frontend URL with **no trailing slash** and **no path** (e.g. `https://blackhr.vercel.app`, not `.../dashboard`).
- Render **Shell** and **persistent disks** require a paid plan. The Docker entrypoint auto-seeds when the database is empty so the free tier works without manual seeding.

### Vercel (frontend)

Set in the Vercel project **Environment Variables** (Production and Preview):

```env
VITE_API_URL=https://<your-render-service>.onrender.com/api/v1
```

Redeploy after changing `VITE_API_URL` — Vite bakes it at build time.

Monorepo settings are in `apps/web/vercel.json` (install/build commands, SPA rewrites).

### CORS troubleshooting

The browser sends an `Origin` header **without** path or trailing slash:

```http
Origin: https://blackhr-cayod06d8-aditya-pradhans-projects.vercel.app
```

That value must match an entry in `CORS_ORIGINS`. Preview URLs change per Vercel deploy (`blackhr-<hash>-...vercel.app`), which is why `https://*.vercel.app` is recommended.

If API requests fail with empty response headers in DevTools, check:

1. `CORS_ORIGINS` on Render matches the frontend origin (or uses a wildcard)
2. Render service was **redeployed** after env changes
3. Vercel `VITE_API_URL` points at the Render API URL

### Production checklist

```bash
pnpm build                              # verify local build
docker compose up --build               # verify containerized run
curl https://<api-host>/api/v1/health   # {"status":"ok"}
curl "https://<api-host>/api/v1/employees?limit=1"  # verify seed data
```

---

## Resources

**Deployed FE:** [Link here](https://blackhr-web.vercel.app)
**Deployed BE:** [Link here](https://blackhr-api.onrender.com). NOTE: BE service warm-up takes time because of the free tier.
**Release notes:** [Link here](https://github.com/adityapradhan10/blackhr/releases/tag/v1.1.0)
**Demo:** [Link here](https://drive.google.com/file/d/125EeiMXHcCIZ9lJh6oSVzHGwhZpPkPV2/view?usp=sharing)

---

## Known limitations

- No authentication or authorization
- SQLite instead of PostgreSQL — ephemeral on Render free tier (auto-reseeds on empty DB)
- No rate limiting, audit logging, or observability
- Dashboard cache is not invalidated when employees are created/deleted (stale for up to 30s)
- Search uses SQL `contains`, not full-text search

