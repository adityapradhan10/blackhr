# Step 01 — Monorepo Foundation Setup

## Objective

Initialize the foundational monorepo structure for the Salary Management Tool.

This step is intentionally limited to repository setup and project scaffolding only.

Do NOT implement:

- business logic
- database configuration
- API endpoints
- employee models
- salary insight functionality
- authentication
- UI implementation

The goal is only to establish a maintainable project foundation.

---

## Technical Constraints

Frontend requirements:

- React
- Tailwind (integration later)
- Tremor UI (integration later)

Backend requirements:

- Node + NestJS

Monorepo requirements:

- pnpm workspace
- Turborepo

---

## Expected Folder Structure

Create the following structure:

```txt
blackhr/

apps/
  web/
  api/

packages/
  shared-types/
  ts-config/
  eslint-config/

docs/

package.json
pnpm-workspace.yaml
turbo.json
```

---

## Tasks

### 1. Initialize root workspace

Create root package.json:

Requirements:

- private workspace
- package manager: pnpm
- scripts:

```json
{
  "dev": "turbo dev",
  "build": "turbo build",
  "test": "turbo test",
  "lint": "turbo lint"
}
```

Install:

```bash
turbo
typescript
```

as dev dependencies.

---

### 2. Create workspace configuration

Create:

`pnpm-workspace.yaml`

Content:

```yaml
packages:
  - apps/*
  - packages/*
```

---

### 3. Create Turborepo configuration

Create:

`turbo.json`

Requirements:

- build task depends on parent builds
- dev should be persistent
- disable caching for dev
- include lint and test tasks

Suggested configuration:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {}
  }
}
```

---

### 4. Generate applications

Create backend application:

- NestJS application inside:

```txt
apps/api
```

Requirements:

- TypeScript
- package manager: pnpm

Create frontend application:

```txt
apps/web
```

Requirements:

- Vite
- React
- TypeScript

---

### 5. Create shared packages

Create:

```txt
packages/shared-types
packages/ts-config
packages/eslint-config
```

---

### 6. Configure shared TypeScript package

Create:

`packages/ts-config/base.json`

Content:

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Node",
    "skipLibCheck": true
  }
}
```

---

### 7. Configure shared-types package

Create package:

```txt
packages/shared-types/package.json
```

Content:

```json
{
  "name": "@blackhr/shared-types",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "import": "./src/index.ts",
      "default": "./src/index.ts"
    }
  }
}
```

Exports both TypeScript types **and** runtime constants (workforce options, sort enums). No Nest DTOs in this package.

---

### 8. Validation

Verify:

- workspace installs successfully
- turbo recognizes all workspaces
- frontend starts
- backend starts

Expected commands:

```bash
pnpm install
pnpm dev
```

Expected result:

- Nest application starts
- Vite application starts

---

## Deliverables

Expected output after completion:

✓ Monorepo initialized

✓ React app created

✓ Nest app created

✓ Shared packages created

✓ Turbo configuration working

✓ Workspace configuration working

---

## Commit

Create incremental commit:

```bash
git add .
git commit -m "chore: initialize turborepo monorepo with React and Nest apps"
```

---

## Notes

Avoid premature abstractions.

Do NOT create:

- UI component package
- Prisma
- Docker
- Database configuration
- Shared utilities
- Authentication

These will be added incrementally in later steps.
