# Step 04 - Database Foundation and Employee Schema

## Objective

Set up database infrastructure and define the first version of the employee data model.

Do not implement:

- CRUD APIs
- Salary calculations
- Frontend UI
- Seed generation logic

Goal:

Establish a stable schema before building features.

## Install Dependencies

Install Prisma for the API package:

```bash
pnpm add -F @blackhr/api @prisma/client @prisma/adapter-better-sqlite3 better-sqlite3
pnpm add -D -F @blackhr/api prisma @types/better-sqlite3
```

## Database

Database:

```txt
SQLite
```

Environment variable:

```env
DATABASE_URL="file:./dev.db"
```

Expected local setup:

```env
DATABASE_URL="file:./dev.db"
```

Do not hardcode database values.

Ignore local database files in Git:

```gitignore
*.db
*.db-journal
*.db-shm
*.db-wal
```

## Prisma Schema

Create:

```txt
apps/api/prisma/schema.prisma
apps/api/prisma.config.ts
```

Requirements:

- SQLite datasource.
- Database URL configured in `prisma.config.ts`, not in `schema.prisma`.
- Prisma client generation.
- Employee model with salary analytics indexes.
- SQLite-compatible field types.

Employee fields:

- `id`
- `employeeId`
- `fullName`
- `email`
- `jobTitle`
- `department`
- `country`
- `salary` as an integer amount in cents.
- `currency`
- `employmentType` as a string value.
- `joiningDate`
- `createdAt`
- `updatedAt`

Supported employment type values:

- `FULL_TIME`
- `PART_TIME`
- `CONTRACT`

Keep these values enforced at the application validation layer for now. SQLite does not need a Prisma enum for this foundation step.

Required indexes:

- `country`
- `jobTitle`
- `country + jobTitle`

## Database Integration

Create:

```txt
apps/api/src/database/prisma.service.ts
apps/api/src/database/prisma.module.ts
```

Requirements:

- `PrismaService` extends `PrismaClient`.
- `PrismaClient` receives `PrismaBetterSqlite3` for runtime connections.
- Runtime adapter reads `process.env.DATABASE_URL`.
- Connect on module init.
- Disconnect on module destroy.
- Export `PrismaService` from a global module.
- Import the module into `AppModule`.

## Migration

Create an initial migration for the SQLite schema:

```bash
DATABASE_URL="file:./dev.db" pnpm -F @blackhr/api exec prisma migrate dev --name init_employee_schema
```

## Validation

Verify:

```bash
DATABASE_URL="file:./dev.db" pnpm -F @blackhr/api exec prisma validate
DATABASE_URL="file:./dev.db" pnpm -F @blackhr/api exec prisma generate
pnpm -F @blackhr/api test
pnpm -F @blackhr/api lint
pnpm -F @blackhr/api build
```
