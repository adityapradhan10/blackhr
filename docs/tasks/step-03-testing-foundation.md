# Step 06 — Testing Foundation

## Objective

Establish the testing infrastructure for backend and frontend.

Goal:

Create a maintainable test setup before implementing business features.

Future development should follow:

1. Write test
2. Implement functionality
3. Refactor

Do NOT:

- Create large numbers of placeholder tests
- Add E2E tests
- Add browser automation

Focus only on unit/integration foundations.

---

## Backend Setup

Nest already includes Jest.

Install additional dependencies:

```bash
pnpm add -D -F api \
@nestjs/testing \
jest-mock-extended
```

Create:

```txt
apps/api/test/

helpers/
mocks/
factories/
```

---

## Create shared test helpers

Create:

```txt
factories/

employee.factory.ts
```

Purpose:

Generate reusable employee objects:

```ts
{
   fullName:"John Doe",
   email:"john@example.com",
   salary:100000
}
```

---

## Mocking strategy

Requirements:

Service tests:

Mock:

```ts
PrismaService
Repositories
```

Avoid:

```ts
real database calls
```

---

## Frontend Setup

Install:

```bash
pnpm add -D -F web \
vitest \
@testing-library/react \
@testing-library/jest-dom \
jsdom
```

Create:

```txt
apps/web/src/test/
```

Configure:

```txt
vitest.config.ts
setupTests.ts
```

---

## Add workspace scripts

Root:

```json
{
   "scripts": {
      "test":"turbo test",
      "test:watch":"turbo test --watch",
      "test:coverage":"turbo test --coverage"
   }
}
```

---

## Initial tests

Create only minimal tests.

Backend:

```txt
HealthService
```

Verify:

```ts
returns status ok
```

Frontend:

```txt
App component
```

Verify:

```ts
renders successfully
```

---

## Validation

Verify:

```bash
pnpm test
```

Expected:

✓ Backend tests pass

✓ Frontend tests pass

✓ Coverage works

✓ Watch mode works

---

## Commit

```bash
git add .

git commit -m "test: setup testing foundation"
```

---

## Notes

From the next step onward:

New services and business logic should be implemented with tests alongside them.

Testing priority:

EmployeeService
SalaryInsightService
Aggregation logic
