# Frontend Architecture

The frontend adapts **MVC layering** for React. Each feature module (`employees`, `dashboard`) is a vertical slice with explicit layer boundaries.

```txt
View (dumb JSX)
  → Controller (orchestration, local UI state)
    → Hook (React Query only)
      → Model (axios API calls)
        → shared/services/api.ts
          → Backend
```

---

## Layer responsibilities

| Layer | Owns | Must NOT |
|---|---|---|
| **View** | Render props, fire callbacks | Call API, hold business logic, use React Query |
| **Controller** | Debounce, pagination, dialog open/close, compose hooks | Direct axios calls |
| **Hook** | `useQuery` / `useMutation`, cache keys, invalidation | UI state (dialog open, search input) |
| **Model** | HTTP methods, typed request/response | React imports |

### Views are intentionally dumb

`employees-page.tsx` receives everything from `useEmployeesPageController()`. This makes page tests straightforward: mock the axios adapter, render the page, assert user flows — without coupling to React Query internals.

### Controllers own orchestration

Page-level concerns don't belong in JSX or data hooks:

- Search debounce (300ms) before updating the query
- Reset page to 1 when filters change
- Open/close create form and delete confirmation dialog
- Compose multiple hooks into a single controller return object

### Hooks own server state

React Query logic (keys, stale time, invalidation) stays isolated. Mutations invalidate `['employees']` on success so the list refetches.

### Models own HTTP paths

`employee.api.ts` centralizes paths and response typing. Changing `/employees` → `/v2/employees` requires one file edit.

---

## Dependency rules

```txt
views/          → controllers/, shared/components/
controllers/    → hooks/, types/ (Zod)
hooks/          → models/
models/         → shared/services/api.ts, @blackhr/shared-types
```

**Forbidden:**

- Views importing models or hooks directly (must go through controller)
- Models importing React
- Hooks holding UI state (dialog open, form visibility)
- API calls inside view components

These rules are enforced by convention and code review. The structure in `apps/web/src/modules/` makes violations obvious.

---

## Key files (employee module)

```txt
apps/web/src/modules/employees/
├── views/employees-page.tsx
├── controllers/useEmployeesPageController.ts
├── controllers/useEmployeeFormController.ts
├── hooks/useEmployees.ts, useCreateEmployee.ts, ...
├── models/employee.api.ts
└── types/index.ts               # Zod form schema (frontend-only)
```

Global infrastructure:

- `shared/providers/QueryProvider.tsx` — 30s stale time, retry: 1
- `shared/services/api.ts` — axios instance with base URL
- `routes/index.tsx` — `/dashboard`, `/employees`

---

## Why Redux was not selected

Redux solves **global client state synchronization**. This app has almost none:

- Employee list, dashboard metrics, insights → **server state** (async, cached, invalidated)
- Dialog open, search input, current page → **local UI state** in controllers (`useState`)

React Query already handles fetch/cache/invalidate/retry for server data. Adding Redux would duplicate that responsibility or require RTK Query — a second async cache layer.

---

## Why Zustand was not selected

Zustand is lightweight global state. The UI state graph is small and page-scoped:

- Employees page: search, filters, pagination, two dialogs
- Dashboard page: mostly read-only server data

`useState` in controller hooks is sufficient. A global store would add indirection without reducing complexity — every page would still need its own slice or selectors.

---

## Why traditional component-folder organization was not selected

A flat `components/` + `hooks/` + `pages/` structure scatters one feature across multiple top-level folders. Adding a filter to employees touches unrelated dashboard files in the same directories.

**Feature modules** (`modules/employees/`, `modules/dashboard/`) keep views, controllers, hooks, and models co-located. Each module is a vertical slice that can be understood and tested independently.

---

## React Query configuration

```typescript
// QueryProvider.tsx
staleTime: 30_000,           // 30s before refetch on remount
retry: 1,
refetchOnWindowFocus: false,
```

Query keys include the full filter object:

```typescript
queryKey: ['employees', query]
```

The controller stabilizes `query` with `useMemo` so the key doesn't change on every render.

**Known gap:** Employee mutations invalidate `['employees']` but not dashboard metrics. Dashboard totals can be stale for up to 30s after CRUD. See [tradeoffs.md](./tradeoffs.md).

---

## Form validation

Frontend uses **Zod + React Hook Form** (`types/index.ts`). Backend uses **class-validator DTOs**. Both align with `@blackhr/shared-types` at compile time, but runtime validation is duplicated intentionally — frontend cannot run Nest decorators.

---

## Related documents

| Document | Purpose |
|---|---|
| [overview.md](./overview.md) | Monorepo and full-stack flow |
| [tradeoffs.md](./tradeoffs.md) | React Query vs Redux, other decisions |
| [../testing/testing-strategy.md](../testing/testing-strategy.md) | How frontend layers are tested |
