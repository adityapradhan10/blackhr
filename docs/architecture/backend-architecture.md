# Backend Architecture

The API is a **NestJS modular monolith** with strict layering. Business logic never lives in controllers; Prisma never appears outside repositories.

---

## Nest module structure

```txt
apps/api/src/
├── main.ts                    # bootstrap, ValidationPipe, CORS, /api/v1 prefix
├── app.module.ts              # root wiring
├── database/
│   ├── prisma.module.ts
│   └── prisma.service.ts      # PrismaClient + better-sqlite3 adapter
└── modules/
    ├── employees/
    │   ├── employees.module.ts
    │   ├── controllers/
    │   ├── services/
    │   ├── repositories/
    │   └── dto/
    └── salary-insights/
        ├── controllers/
        ├── services/
        ├── repositories/
        └── dto/
```

Each domain module owns its controller, service, repository, and DTOs. `AppModule` imports feature modules; feature modules don't import each other.

---

## Request lifecycle

```txt
HTTP Request
  → ValidationPipe (global, main.ts)
  → Controller (route + Swagger)
  → Service (business rules)
  → Repository (query composition)
  → Prisma
  → SQLite
```

Global pipe configuration:

```typescript
new ValidationPipe({
  forbidNonWhitelisted: true,  // reject unknown fields
  transform: true,             // coerce query strings to numbers/dates
  whitelist: true,             // strip undeclared properties
});
```

DTOs run **before** the controller method body executes. Malformed requests fail fast with 400.

---

## Repository pattern

Services depend on an **interface port**, not Prisma:

```typescript
// employees.repository.ts exports
export const EMPLOYEES_REPOSITORY = Symbol('EMPLOYEES_REPOSITORY');
export interface EmployeesRepositoryPort { ... }
export class EmployeesRepository implements EmployeesRepositoryPort { ... }
```

Module wiring:

```typescript
providers: [
  EmployeesService,
  { provide: EMPLOYEES_REPOSITORY, useClass: EmployeesRepository },
],
```

Service constructor:

```typescript
constructor(
  @Inject(EMPLOYEES_REPOSITORY)
  private readonly employeesRepository: EmployeesRepositoryPort,
) {}
```

### Why repository if Prisma already abstracts SQL?

The repository encapsulates **domain query composition**:

- `buildWhere()` — search, country, department, jobTitle filters
- `buildOrderBy()` — dynamic sort column validation
- `Promise.all([findMany, count])` — parallel list + total

It also provides a **test seam**. Service unit tests mock `EmployeesRepositoryPort` — no SQLite, no Docker, millisecond execution.

Prisma stays an implementation detail. A future Postgres migration changes the repository, not every service method.

---

## Prisma integration

- **Schema:** `apps/api/prisma/schema.prisma` — Employee model + indexes
- **Migrations:** `prisma/migrations/` — versioned SQL
- **Client:** Generated at build time; injected via `PrismaService`
- **Adapter:** `@prisma/adapter-better-sqlite3` for SQLite in Prisma 7

Indexes match query patterns:

```prisma
@@index([country])
@@index([jobTitle])
@@index([country, jobTitle])
```

Salary insights use Prisma `aggregate`, `groupBy`, and `$queryRaw` for median and histogram — never `findMany()` + JavaScript reduce.

---

## DTO validation

DTOs **implement** shared-types interfaces and add transport decorators:

```typescript
export class CreateEmployeeDto implements CreateEmployeeRequest {
  @IsEmail()
  @ApiProperty()
  email: string;

  @Min(1)
  @ApiProperty()
  salary: number;

  @Type(() => Date)
  @IsDate()
  joiningDate: Date;
}
```

| Concern | Where |
|---|---|
| HTTP shape + Swagger | DTO decorators |
| Compile-time contract alignment | `implements CreateEmployeeRequest` |
| Business invariants | Service (`validateCreateDto`, email conflict check) |

**Defense in depth:** DTO catches malformed HTTP; service validates even if called internally later. Tradeoff: some rules exist in both places (e.g. `salary > 0`).

Query DTOs (`EmployeeQueryDto`) coerce string query params to numbers and validate enum sort columns before the repository sees them.

---

## Service separation

Controllers are one-liners:

```typescript
createEmployee(@Body() dto: CreateEmployeeDto): Promise<EmployeeRecord> {
  return this.employeesService.createEmployee(dto);
}
```

Services own:

- Email uniqueness checks (`ConflictException`)
- Pagination cap (`limit` max 100)
- Default values (`currency: 'USD'`, `department: 'General'`)
- Employee ID generation (`BHR-${randomUUID()}`)
- Not-found and bad-request semantics for insights

Salary insights service converts empty aggregates to 404 and rounds averages — presentation rules that don't belong in SQL or controllers.

---

## Salary insights module

Aggregations run in the **repository/DB layer** per project rules:

| Operation | Mechanism |
|---|---|
| Min/max/avg/count | Prisma `aggregate` |
| Highest paying country/role | `groupBy` + `_avg.salary` ordered desc |
| Median salary | `$queryRaw` (no Prisma median built-in) |
| Salary histogram | `$queryRaw` with bucket arithmetic |
| Department headcount | `groupBy` department |

Dashboard endpoint runs six queries in parallel via `Promise.all` — acceptable at 10k rows, a bottleneck at 100k+.

---

## Testing seam

```typescript
// Direct instantiation — no Nest testing module
const repository = createRepository(); // jest.Mocked<EmployeesRepositoryPort>
const service = new EmployeesService(repository);
```

See [../testing/testing-strategy.md](../testing/testing-strategy.md) for mock patterns.

---

## Related documents

| Document | Purpose |
|---|---|
| [overview.md](./overview.md) | Full-stack flow and shared contracts |
| [tradeoffs.md](./tradeoffs.md) | SQLite, no auth, scaling limits |
| [../performance/seed-strategy.md](../performance/seed-strategy.md) | Bulk insert strategy |
