# Architecture Overview

BlackHR is a **pnpm + Turborepo monorepo** with two applications and shared packages. The goal is a single repository where API contract changes propagate to frontend and backend atomically.

```txt
blackhr/
├── apps/
│   ├── api/          # NestJS backend (@blackhr/api)
│   └── web/          # React + Vite frontend (@blackhr/web)
├── packages/
│   ├── shared-types/ # API contract types (FE + BE)
│   ├── eslint-config/
│   ├── prettier-config/
│   └── ts-config/
├── docs/             # Architecture, testing, performance notes
├── package.json      # Root scripts via turbo
├── pnpm-workspace.yaml
└── turbo.json
```

---

## Why monorepo?

The dominant coupling is the HTTP API contract. Employee shapes, pagination meta, and dashboard metrics are consumed by both apps. A monorepo with `@blackhr/shared-types` eliminates type drift that would occur if types were duplicated across separate repositories.

Turborepo orchestrates build/lint/test with dependency ordering (`dependsOn: ["^build"]`). One PR can change types, API, UI, and tests together.

---

## Backend request flow

```txt
Controller
    ↓
Service
    ↓
Repository
    ↓
Prisma
    ↓
Database
```

| Layer | Responsibility |
|---|---|
| **Controller** | HTTP routing, Swagger docs, delegates to service — no business logic |
| **Service** | Business rules: validation, conflict checks, pagination caps |
| **Repository** | Query composition (`buildWhere`, `buildOrderBy`), Prisma calls |
| **Prisma** | ORM with type-safe queries and migrations |
| **SQLite** | Local persistence via `better-sqlite3` adapter |

Example trace — `POST /api/v1/employees`:

1. Global `ValidationPipe` in `main.ts` validates `CreateEmployeeDto`
2. `EmployeesController.createEmployee` delegates to service
3. `EmployeesService.createEmployee` checks email uniqueness, applies defaults
4. `EmployeesRepository.create` runs `prisma.employee.create`
5. JSON response serializes `Date` fields to ISO strings

Services depend on **repository ports** (`EmployeesRepositoryPort` + Symbol token), not Prisma directly. Unit tests mock the port — no database required.

See [backend-architecture.md](./backend-architecture.md) for module structure and DI wiring.

---

## Frontend request flow

```txt
View
    ↓
Controller
    ↓
Hook
    ↓
Model
    ↓
API
```

| Layer | Responsibility |
|---|---|
| **View** | Dumb JSX — renders props, fires callbacks |
| **Controller** | Page orchestration: debounce, pagination, dialog state |
| **Hook** | React Query (`useQuery` / `useMutation`), cache keys, invalidation |
| **Model** | Typed axios methods, HTTP paths |
| **API** | Shared axios instance (`shared/services/api.ts`) |

Example trace — employee list page:

1. `EmployeesPage` calls `useEmployeesPageController()`
2. Controller debounces search (300ms), builds `EmployeeQuery` via `useMemo`
3. `useEmployees(query)` fetches via React Query
4. `employeeApi.listEmployees` → `GET /employees`
5. View renders table with controller props — no direct API calls in JSX

See [frontend-architecture.md](./frontend-architecture.md) for dependency rules and rejected alternatives.

---

## Shared contracts

`packages/shared-types/src/index.ts` defines the cross-boundary API contract:

- Domain: `Employee`, `EmploymentType`
- Requests: `CreateEmployeeRequest`, `EmployeeQuery`
- Responses: `PaginatedResponse<T>`, `DashboardMetrics`, insight types

Both apps import via `"@blackhr/shared-types": "workspace:^"`.

### Why types only, not DTOs?

Backend DTOs carry Nest decorators (`@IsEmail`, `@ApiProperty`, `@Type(() => Date)`). The frontend should not depend on backend framework code. Frontend form validation uses **Zod** separately.

### Why not share Prisma models?

Prisma types are backend-generated, use `Date` objects, and leak persistence concerns. The HTTP contract uses ISO date strings. JSON serialization bridges the gap at the wire boundary.

---

## Module boundaries

Both apps use **feature modules** as vertical slices:

```txt
modules/employees/     # CRUD, filters, table
modules/dashboard/     # Salary analytics, charts
modules/salary-insights/  # (API only)
```

This is a **modular monolith** — not microservices. Clear boundaries inside one API process and one web app.

---

## Related documents

| Document | Purpose |
|---|---|
| [frontend-architecture.md](./frontend-architecture.md) | MVC adaptation, layer rules |
| [backend-architecture.md](./backend-architecture.md) | Nest modules, repository pattern |
| [tradeoffs.md](./tradeoffs.md) | Deliberate decisions and rejected options |
