# Seed Strategy

How BlackHR generates 10,000 employees deterministically and efficiently.

---

## Goals

| Requirement | Why |
|---|---|
| **10,000 employees** | Matches assessment scale; stresses pagination and aggregations |
| **Deterministic output** | Same data every run → stable tests, demos, dashboard metrics |
| **Fast repeated runs** | Seed runs frequently during development — must complete in seconds |
| **Idempotent** | Re-running seed must not duplicate rows or fail on unique constraints |

---

## File layout

```txt
apps/api/prisma/seed/
├── constants.ts              # SEED_EMPLOYEE_COUNT, BATCH_SIZE, domains
├── employee-generator.ts     # Deterministic row builder
└── seed.ts                   # Orchestration (delete + batched insert)

apps/api/assets/
├── first_names.txt
└── last_names.txt
```

Registered in `apps/api/prisma.config.ts`:

```bash
pnpm -F @blackhr/api exec prisma db seed
```

---

## createMany batching

```typescript
// seed.ts
await prisma.employee.deleteMany();

for (let offset = 0; offset < employeeCount; offset += batchSize) {
  const currentBatchSize = Math.min(batchSize, employeeCount - offset);
  const employees = generator.generateEmployees(currentBatchSize, offset);
  const result = await prisma.employee.createMany({ data: employees });
  insertedCount += result.count;
}
```

| Constant | Value | Reason |
|---|---|---|
| `SEED_EMPLOYEE_COUNT` | 10,000 | Assessment requirement |
| `BATCH_SIZE` | 1,000 | Balance memory vs round trips |

### Why createMany?

`AGENTS.md` forbids row-by-row inserts for seed operations:

- **10,000 individual inserts** → 10,000 round trips, seconds to minutes
- **10 batched createMany calls** → 10 round trips, completes in ~1–2 seconds

`createMany` skips per-row Prisma middleware hooks — none exist today, so this is acceptable.

### Why batch size 1,000?

- Holds ~1k employee objects in memory per iteration — negligible (~few MB)
- 10 round trips is fast enough; batch size 10,000 would spike memory without meaningful speed gain
- If count grows to 100k, same pattern scales linearly (100 batches)

---

## Deterministic generation

```typescript
// employee-generator.ts
private seededInt(index: number, modulo: number): number {
  return (FAKER_SEED + index * 1_103_515_245 + 12_345) % modulo;
}
```

Each employee index produces:

| Field | Strategy |
|---|---|
| `fullName` | Names from static text files, index-modulo selection |
| `email` | Derived from name + employee number — unique per index |
| `employeeId` | Sequential `BHR-00001`, `BHR-00002`, … |
| `salary` | Seeded PRNG from index |
| `country`, `jobTitle`, `department` | Modulo rotation over constants |

### Why not Faker-only random?

- Non-deterministic tests fail when expected emails/counts change
- Duplicate `email` / `employeeId` risk without careful seed management
- Demos and screenshots show different data each run

Static name files + seeded PRNG give "realistic enough" data with guaranteed reproducibility.

---

## Repeated runs

```typescript
await prisma.employee.deleteMany();  // wipe before insert
```

Every seed run:

1. Deletes all existing employees
2. Inserts 10,000 fresh rows in batches

Safe to run before demos, after schema changes, or in CI. Tests in `apps/api/test/seed/` verify orchestration and generator determinism without hitting a real database (mocked `SeedPrismaClient`).

---

## Why this scales (to 10k and slightly beyond)

| Mechanism | Effect |
|---|---|
| Bulk `createMany` | O(n/batchSize) DB round trips, not O(n) |
| No per-row business logic | Generator is pure; no service layer in seed path |
| Indexes created by migration | Post-seed queries use country/jobTitle indexes |
| Deterministic | No retry loops for unique constraint collisions |
| SQLite single file | No network latency to database server |

### What does not scale

| Limit | At 10k | At 100k+ |
|---|---|---|
| SQLite single writer | Fine for seed + dev API | Contention under concurrent writes |
| `deleteMany` full wipe | Fast (~ms) | Slower; may need truncate strategy |
| Memory per batch | 1k rows trivial | Increase batch size carefully |
| Seed time | ~1–2s | ~10–20s linear — still acceptable |

For production at 100k+, consider: PostgreSQL `COPY`, parallel workers, incremental seed (append-only), or pre-built database snapshots.

---

## Employee ID inconsistency (intentional)

| Path | Format |
|---|---|
| Seed | `BHR-00001` (sequential, human-readable) |
| API create | `BHR-${randomUUID()}` (collision-free without central sequence) |

Seed prioritizes reproducibility and demo readability. API create prioritizes uniqueness without a sequence table. Documented as acceptable assessment debt in [../architecture/tradeoffs.md](../architecture/tradeoffs.md).

---

## Related documents

| Document | Purpose |
|---|---|
| [../architecture/backend-architecture.md](../architecture/backend-architecture.md) | Prisma integration |
| [../testing/testing-strategy.md](../testing/testing-strategy.md) | Seed/generator tests |
| [../tasks/step-05-seed-system.md](../tasks/step-05-seed-system.md) | Original implementation spec |
