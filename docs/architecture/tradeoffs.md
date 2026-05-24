# Architecture Tradeoffs

Deliberate decisions made for a 10,000-employee HR salary system. Each choice optimizes for **assessment clarity, local dev speed, and testability** over production hardening.

---

## SQLite instead of PostgreSQL

**Decision:** SQLite via Prisma + `better-sqlite3` adapter.

**Why:**

- Zero database hosting for local dev and Docker deployment
- Sufficient for 10k employee records and assessment-scale analytics
- Single file persistence — mount a volume in Docker/Railway and done
- Faster onboarding: no Postgres container, no connection string management

**Tradeoffs:**

- Single-writer concurrency — not suitable for high write throughput
- No replication, no connection pooling story
- Raw SQL in salary insights (median, histogram) is SQLite-specific
- `contains` search does full table scans without full-text indexing

**Upgrade path:** PostgreSQL + connection pooling + `tsvector` full-text search. Repository port pattern means services don't change — only repository SQL.

`AGENTS.md` mentions PostgreSQL as the target stack; SQLite was chosen at implementation time to reduce deployment complexity (see step-16 productionization notes).

---

## Single-tenant decision

**Decision:** One organization, one database, no tenant isolation.

**Why:**

- HR Manager persona manages one company's workforce
- No multi-org routing, schema-per-tenant, or row-level tenant keys
- Simpler queries, simpler seed, simpler dashboard aggregations

**Tradeoffs:**

- Cannot serve multiple companies from one deployment without schema changes
- Acceptable for assessment scope; SaaS would need tenant ID on every table

---

## No authentication

**Decision:** All API endpoints are open. No JWT, sessions, or API keys.

**Why:**

- Assessment focuses on CRUD, analytics, and architecture — not identity
- Removes auth middleware, user tables, token refresh, and login UI
- Faster to demo and test locally

**Tradeoffs:**

- Not deployable to the public internet without a reverse proxy or API gateway adding auth
- Employee salary data is unprotected at the API layer

**Future:** Nest guards + JWT or session middleware; HR Manager role as the only required persona initially.

---

## No RBAC

**Decision:** No roles, permissions, or resource-level access control.

**Why:**

- Single persona (HR Manager) with full access to all employees and insights
- RBAC adds policy tables, guard decorators, and UI gating without changing core features

**Tradeoffs:**

- Cannot restrict salary visibility by department or manager hierarchy
- Pair with auth when adding multiple personas (employee self-service, exec read-only)

---

## React Query vs Redux

**Decision:** React Query for server state; `useState` in controllers for UI state.

| | React Query | Redux (+ RTK Query) |
|---|---|---|
| Server cache | Built-in stale/fresh, invalidation | Needs RTK Query or manual sagas |
| Boilerplate | Hooks per resource | Store, slices, selectors, middleware |
| Fit for this app | List, CRUD, dashboard metrics are all server-fetched | Overkill for dialog open + search input |

**Why not Redux alone:** Redux doesn't solve async cache invalidation. You'd still need RTK Query — effectively two abstractions for what React Query provides natively.

**Why not Zustand:** Global client state graph is tiny and page-scoped. Controllers with `useState` are simpler than a store with selectors.

**Known gap:** Dashboard cache is not invalidated on employee CRUD. Totals can be stale for up to 30s (`staleTime`). Fix: invalidate `DASHBOARD_METRICS_QUERY_KEY` in mutation `onSuccess`, or use optimistic updates.

---

## Performance vs complexity

| Choice | Performance win | Complexity cost |
|---|---|---|
| Server-side pagination + filters | Never loads 10k rows to browser or Node | Offset pagination degrades at deep pages |
| Search debounce (300ms) | 1 query per pause, not per keystroke | Controller state + `useEffect` timer |
| `createMany` seed batches | ~10 DB round trips vs 10,000 | Batch size tuning, memory per batch |
| DB indexes on filter columns | Faster `where country = ?` and groupBy | Migration maintenance |
| SQL aggregations for insights | No 10k-row transfer to Node | SQLite-specific raw SQL |
| Repository port + Symbol DI | Fast unit tests | Extra abstraction for single Prisma impl |
| MVC frontend layers | Testable views and controllers | More files per feature |
| Shared-types (types + domain constants) | Single source for API shapes and dropdown/sort enums | Zod + class-validator still separate at runtime |
| 6 parallel dashboard queries | Parallel I/O on single machine | N+1 at API design level for country chart |
| No optimistic updates | Simpler mutation flow | User waits for refetch after create |

---

## Other rejected options

| Alternative | Why rejected |
|---|---|
| Microservices | Assessment-scale modular monolith is sufficient; ops overhead not justified |
| Share backend DTOs with frontend | Pulls Nest/class-validator into web bundle |
| Duplicate workforce constants per app | Caused dashboard 404s when UI job titles diverged from seed data |
| Share Prisma models with frontend | Leaks ORM; wrong date types |
| MSW for frontend tests | Axios adapter mock is simpler; tests real axios + React Query |
| Snapshot-heavy UI tests | Brittle on CSS/copy; low signal for business logic |
| Faker-only random seed | Non-deterministic tests and demos |
| Row-by-row seed inserts | Violates performance rules; 10k round trips |

---

## Acceptable for assessment, not production

- No rate limiting, audit logging, or observability
- No soft deletes
- Generic error messages ("Invalid request")
- Employee ID format differs: seed uses `BHR-00001`, API create uses `BHR-${uuid}`
- Dashboard country comparison fires 6 HTTP requests instead of one grouped endpoint
- No repository integration tests against real SQL

---

## Related documents

| Document | Purpose |
|---|---|
| [overview.md](./overview.md) | Architecture summary |
| [../performance/seed-strategy.md](../performance/seed-strategy.md) | Bulk insert rationale |
