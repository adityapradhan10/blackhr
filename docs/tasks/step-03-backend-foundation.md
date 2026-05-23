# Step 03 - Backend Foundation

## Objective

Prepare backend infrastructure and project conventions.

Do not implement:

- Employee CRUD
- Salary logic
- Business services
- Database models
- Seed logic

Goal:

Create a clean backend foundation that future features can plug into.

## Tasks

### Environment Management

Install and configure `@nestjs/config`.

Create:

```txt
apps/api/src/config/
  configuration.ts
  env.schema.ts
```

Requirements:

- Validate environment variables.
- Fail application startup on invalid config.

Required variables:

```env
PORT=3001
DATABASE_URL=
NODE_ENV=development
```

### Shared Module Structure

Create:

```txt
apps/api/src/common/
apps/api/src/config/
apps/api/src/database/
apps/api/src/modules/employees/
apps/api/src/modules/salary-insights/
```

Only folders for now. No business implementation.

### Global Validation

Install and configure:

- `class-validator`
- `class-transformer`
- `ValidationPipe`
- `whitelist=true`
- `forbidNonWhitelisted=true`
- `transform=true`

### Global API Prefix

Configure `/api/v1`.

Example:

```txt
/api/v1/employees
```

### Swagger

Install and configure `@nestjs/swagger`.

Swagger endpoint:

```txt
/api/docs
```

Purpose:

- API discoverability.
- Easier frontend integration.

### Health Endpoint

Create:

```txt
GET /api/v1/health
```

Response:

```json
{
  "status": "ok"
}
```

## Validation

Verify:

```bash
pnpm --filter @blackhr/api dev
```

Expected:

- Nest app starts.
- Swagger is available.
- Health endpoint works.
- Environment validation works.
