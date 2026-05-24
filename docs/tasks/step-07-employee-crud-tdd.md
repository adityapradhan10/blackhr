# Step 07 — Employee CRUD APIs (Test-first)

## Objective

Implement employee management APIs using a test-first workflow.

Workflow for each feature:

1. Write service test
2. Run test and verify failure
3. Implement service logic
4. Make test pass
5. Refactor

Do NOT implement:

- salary insights
- frontend UI

---

## Folder Structure

Expected:

```txt
apps/api/src/modules/employees/

employees.module.ts

controllers/
    employees.controller.ts

services/
    employees.service.ts

repositories/
    employees.repository.ts

dto/
    create-employee.dto.ts
    update-employee.dto.ts
    employee-query.dto.ts
```

Tests:

```txt
apps/api/src/modules/employees/

services/
   employees.service.spec.ts

controllers/
   employees.controller.spec.ts
```

---

## Architecture

Use:

Controller
    ↓
Service
    ↓
Repository
    ↓
Prisma

Do NOT:

- call Prisma directly from controller
- put business logic in controller

---

## Step A — Create Employee

Write tests first:

```ts
describe('createEmployee',()=>{

   it('creates employee successfully')

   it('throws duplicate email error')

})
```

Implementation requirements:

Validation:

```ts
fullName
email
salary > 0
country
jobTitle
joiningDate
```

API:

```http
POST /api/v1/employees
```

---

## Step B — Get Employee List

Write tests first:

```ts
describe('findAll',()=>{

   it('returns paginated employees')

   it('filters by country')

   it('searches by name')

})
```

API:

```http
GET /api/v1/employees
```

Query support:

```txt
page
limit
search
country
department
jobTitle
sortBy
sortOrder
```

Defaults:

```txt
page=1
limit=20
```

Maximum:

```txt
limit=100
```

---

## Step C — Get Employee By ID

Write tests first:

```ts
describe('findById',()=>{

   it('returns employee')

   it('throws not found')
})
```

API:

```http
GET /api/v1/employees/:id
```

---

## Step D — Update Employee

Write tests first:

```ts
describe('updateEmployee',()=>{

   it('updates employee')

   it('throws if employee missing')
})
```

API:

```http
PATCH /api/v1/employees/:id
```

---

## Step E — Delete Employee

Write tests first:

```ts
describe('deleteEmployee',()=>{

   it('deletes employee')

   it('throws if employee missing')
})
```

API:

```http
DELETE /api/v1/employees/:id
```

---

## Pagination response

Expected:

```json
{
  "data": [],
  "meta": {
    "page":1,
    "limit":20,
    "total":10000,
    "totalPages":500
  }
}
```

---

## Swagger

Document:

- request body
- query params
- responses

---

## Validation

Verify:

✓ tests pass

✓ create works

✓ update works

✓ delete works

✓ pagination works

✓ filtering works

✓ search works

✓ Swagger works

---

## Commit

Commit incrementally:

```bash
git commit -m "test(api): add employee service tests"

git commit -m "feat(api): implement employee CRUD service"

git commit -m "feat(api): implement employee CRUD endpoints"
```

---

## Notes

Avoid:

- testing Prisma directly
- testing framework internals
- loading all 10k rows into memory
- giant service methods
