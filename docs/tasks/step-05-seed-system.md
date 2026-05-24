# Step 05 - High Performance Seed System

## Objective

Create a deterministic and performant seed system that generates 10,000 employees.

Requirements:

- Generate full names from `first_names.txt` and `last_names.txt`.
- Engineers should be able to run the seed repeatedly.
- Seed insertion must use batches, not row-by-row writes.

Do not implement:

- Employee APIs
- Salary insight APIs
- Frontend UI

## Folder Structure

Create:

```txt
apps/api/assets/first_names.txt
apps/api/assets/last_names.txt
apps/api/prisma/seed/constants.ts
apps/api/prisma/seed/employee-generator.ts
apps/api/prisma/seed/seed.ts
```

## Seed Architecture

`employee-generator.ts`:

- Load name assets once.
- Generate deterministic employee objects.
- Produce unique `employeeId` and `email` values.

`seed.ts`:

- Delete existing employees before inserting new rows.
- Insert employees in chunks.
- Return the inserted row count.

`constants.ts`:

- Employee count, batch size, faker seed
- Imports domain lists from `@blackhr/shared-types` (`COUNTRY_OPTIONS`, `DEPARTMENT_OPTIONS`, `JOB_TITLE_OPTIONS`, `EMPLOYMENT_TYPES`)
- Seed-only maps: salary ranges, job title → department

## Employee Generation

Generate:

```ts
{
  employeeId: string;
  fullName: string;
  email: string;
  department: string;
  country: string;
  jobTitle: string;
  salary: number;
  currency: string;
  employmentType: string;
  joiningDate: Date;
}
```

## Data Rules

Domain lists (countries, departments, job titles, employment types) are defined once in `packages/shared-types/src/index.ts` and imported by the seed. Do not duplicate them in `constants.ts`.

Countries (from shared-types):

```ts
['India', 'United States', 'Germany', 'Canada', 'United Kingdom', 'Australia']
```

Departments (from shared-types):

```ts
['Engineering', 'Product', 'HR', 'Finance', 'Sales']
```

Job titles (from shared-types):

```ts
[
  'Software Engineer',
  'Senior Software Engineer',
  'Product Manager',
  'HR Specialist',
  'Finance Analyst',
]
```

Salary values are integer amounts in cents-compatible SQLite storage, generated within realistic role-specific ranges.

## Performance Requirements

Do not insert rows one by one:

```ts
for (...) {
  await prisma.employee.create(...);
}
```

Use `createMany` with batches:

```ts
const BATCH_SIZE = 1000;

await prisma.employee.createMany({
  data: batch,
});
```

## Idempotency Requirements

Before inserting:

```ts
await prisma.employee.deleteMany();
```

This keeps repeated seed runs deterministic and avoids duplicate email/employee ID conflicts.

## Prisma Configuration

Prisma 7 reads the seed command from `apps/api/prisma.config.ts`:

```ts
migrations: {
  path: 'prisma/migrations',
  seed: 'tsx prisma/seed/seed.ts',
}
```

Install:

```bash
pnpm add -F @blackhr/api dotenv
pnpm add -D -F @blackhr/api tsx
```

## Execution

Run:

```bash
DATABASE_URL="file:./dev.db" pnpm -F @blackhr/api exec prisma db seed
```

## Validation

Verify:

- 10,000 employees inserted.
- Repeat seed runs work.
- No duplicate email or employee ID issues.
- Inserts happen in batches.
- Generated data looks realistic enough for salary analytics.
