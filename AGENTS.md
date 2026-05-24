# BlackHR — AI Agent Instructions

## Project Goal

Build a production-quality salary management system for an organization with 10,000 employees.

Primary persona:
- HR Manager

Required capabilities:
- Employee CRUD
- Salary analytics
- Seed generation
- Testing
- Deployment readiness

---

## Tech Stack

Monorepo:
- pnpm
- Turborepo

Frontend:
- React
- Tailwind
- Tremor

Backend:
- NestJS
- PostgreSQL

Language:
- TypeScript strict mode

---

## Architecture Rules

- Keep a modular monolith.
- Do not introduce microservices.
- Business logic belongs in services, never controllers.
- Database aggregations should happen in SQL/database layer.
- Avoid loading large datasets into memory.
- Prefer pagination over full-table retrieval.

---

## Shared Domain Constants

Workforce reference data (countries, departments, job titles, employment types) and employee list sort enums live in `@blackhr/shared-types`:

- `packages/shared-types/src/index.ts` — workforce constants and sort enums (single entry file for Node ESM compatibility)

Rules:

- Do **not** duplicate these lists in the web app or API seed — import from shared-types.
- Web may add UI-only wrappers (e.g. filter dropdown empty “All” option) in `apps/web/src/shared/constants/workforce-options.ts`.
- Seed-only config (salary ranges, job-title→department maps, batch sizes) stays in `apps/api/prisma/seed/constants.ts`.

---

## Employee Domain

Employee fields:

Required:
- id
- fullName
- jobTitle
- country
- salary

Additional fields:
- department
- employmentType
- currency
- createdAt
- updatedAt

---

## Performance Constraints

Assume:
- 10,000+ employees
- Seed script runs frequently

Rules:

- Use bulk insert for seed operations.
- Avoid row-by-row inserts.
- Add indexes for:
  - country
  - jobTitle
  - country + jobTitle

---

## Testing Rules

Prioritize:

1. Service/business logic tests
2. Repository/data tests
3. Core API integration tests

Avoid:

- Trivial component tests
- Snapshot-heavy tests

Tests must be:

- deterministic
- isolated
- fast

---

## Development Rules

Before implementation:

- understand existing patterns
- avoid duplicate abstractions
- avoid premature optimization

After implementation:

- run lint
- run tests
- check types

---

## Commit Rules

Use incremental commits.

Examples:

feat(employee): add CRUD endpoints

feat(insights): add salary aggregation APIs

test(employee): add service tests

docs: add architecture notes

---

## AI Usage Rules

AI-generated code must never be accepted blindly.

Always:

- verify correctness
- verify types
- verify edge cases
- verify performance assumptions
