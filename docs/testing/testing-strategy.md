# Testing Strategy

How BlackHR tests are organized, what gets mocked, and what is intentionally excluded.

---

## Priorities

Per `AGENTS.md`, tests rank by signal-per-second:

1. **Service / business logic** — rules, conflicts, pagination caps, insight rounding
2. **Seed and generator** — deterministic output, batch orchestration
3. **Controller wiring** — delegates to service, route decorators intact
4. **Frontend hooks, controllers, page flows** — user-visible behavior

**Avoided:**

- Snapshot-heavy UI tests (brittle on CSS/copy changes)
- Trivial "renders without crashing" component tests
- Tremor chart rendering details
- Testing React Query internals instead of outcomes

---

## Backend testing

### Service tests (primary)

Services are instantiated directly with a mocked repository port:

```typescript
function createRepository(): jest.Mocked<EmployeesRepositoryPort> {
  return {
    count: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  };
}

const service = new EmployeesService(repository);
```

No Nest testing module. No database. Tests run in milliseconds.

**What's tested:**

| File | Behavior |
|---|---|
| `employees.service.spec.ts` | Email conflict, pagination cap (max 100), not-found, filter passthrough |
| `salary-insights.service.spec.ts` | 404 on empty aggregates, rounding, bad request paths |

**Mock boundary:** `EmployeesRepositoryPort` — tests business rules, not SQL dialect.

### Controller tests

Thin controllers get wiring tests:

```typescript
// employees.controller.spec.ts
expect(service.createEmployee).toHaveBeenCalledWith(dto);
```

Ensures DI and route decorators don't break. Low logic, high regression safety.

### Seed tests

| File | Behavior |
|---|---|
| `employee-generator.spec.ts` | Same index → same email, salary, employeeId |
| `seed.spec.ts` | Batch loop calls `createMany` correct number of times, `deleteMany` first |

Uses mocked `SeedPrismaClient` — no SQLite file required.

### What is NOT tested (backend)

- Repository SQL against real database (`buildWhere` with `contains` never executed in CI)
- E2E HTTP tests with supertest + test DB
- Load/performance benchmarks

**Rationale:** Fast, deterministic CI. Repository integration tests would need testcontainers or in-memory SQLite fixtures — deferred for assessment scope.

---

## Frontend testing

### Stack

- **Vitest** + **Testing Library**
- **React Query** with test-specific client (`retry: false`)
- **Axios adapter mock** — no MSW

### Mock approach

Replace `api.defaults.adapter` to intercept HTTP at the axios layer:

```typescript
api.defaults.adapter = async (config) => {
  // return { data, status, headers } based on config.url/method
};
```

This tests the **real stack**: axios → model → hook → controller → view. Only the transport boundary is mocked.

### Hook tests

```txt
apps/web/test/modules/employees/__tests__/hooks/useEmployeeHooks.test.ts
```

- Query success returns employee list
- Query error surfaces `isError`
- Create mutation invalidates `['employees']` cache key

Uses `renderHookWithQueryClient` helper with isolated `QueryClient`.

### Controller tests

```txt
apps/web/test/modules/employees/__tests__/controllers/useEmployeesPageController.test.ts
```

- Search debounce delays query update
- Filter changes reset page to 1
- Dialog open/close state transitions

No DOM — pure hook testing with `renderHook`.

### Page flow tests

```txt
apps/web/test/modules/employees/employees-page.test.tsx
apps/web/test/modules/dashboard/dashboard-page.test.tsx
```

Full user flows with mocked adapter:

- Search filters table
- Create employee from form
- Delete with confirmation dialog
- Dashboard loading/error/success states

**Behavior testing:** Assert visible text, row counts, button states — not component internal state or snapshot markup.

### Dashboard tests

```txt
apps/web/test/modules/dashboard/__tests__/controllers/useDashboardPageController.test.ts
```

Controller orchestration: parallel insight hooks, formatted currency/count strings.

---

## Mocking summary

| Layer | Mock target | Real |
|---|---|---|
| API service tests | `EmployeesRepositoryPort` | Service class |
| API controller tests | Service methods | Controller class |
| Web hook tests | Axios adapter | React Query, hooks, models |
| Web page tests | Axios adapter | Full component tree |
| Seed tests | `SeedPrismaClient` | Generator logic |

**Principle:** Mock at the **outer boundary** of the unit under test. Don't mock React Query — mock HTTP. Don't mock services in controller tests — mock the repository in service tests.

---

## Running tests

```bash
# All workspaces
pnpm test

# API only
pnpm -F @blackhr/api test

# Web only
pnpm -F @blackhr/web test

# Watch mode
pnpm test:watch
```

Current count: **47 frontend + API tests**, all deterministic.

---

## Tradeoffs

| Pro | Con |
|---|---|
| Fast CI (~15–20s total) | Repository SQL never validated against real DB |
| True behavior tests at HTTP boundary | Mocks can drift from production axios/Prisma behavior |
| No snapshot maintenance | Less regression safety on exact markup |
| Controller tests without DOM | Doesn't catch CSS layout bugs |

---

## Future improvements

1. Repository integration tests with testcontainers (Postgres migration path)
2. Playwright E2E for critical HR flows (create → list → dashboard)
3. Invalidate dashboard cache in mutation tests once fixed in production code

---

## Related documents

| Document | Purpose |
|---|---|
| [../architecture/backend-architecture.md](../architecture/backend-architecture.md) | Repository port testing seam |
| [../architecture/frontend-architecture.md](../architecture/frontend-architecture.md) | Why views are testable |
| [../../AGENTS.md](../../AGENTS.md) | Testing rules |
