# Step 08 — Salary Insight APIs (Test-first)

## Objective

Implement salary analytics APIs for HR users.

Workflow:

1. Write service tests
2. Verify failure
3. Implement logic
4. Pass tests
5. Refactor

Do NOT implement:

- frontend UI
- charts
- dashboards

---

## Folder Structure

Expected:

```txt
apps/api/src/modules/salary-insights/

salary-insights.module.ts

controllers/
    salary-insights.controller.ts

services/
    salary-insights.service.ts

repositories/
    salary-insights.repository.ts

dto/
    salary-country-query.dto.ts
```

Tests:

```txt
services/
    salary-insights.service.spec.ts
```

---

## Required Metrics

From assessment:

### Country metrics

```txt
Minimum salary
Maximum salary
Average salary
```

API:

```http
GET /api/v1/salary-insights/country/:country
```

Expected response:

```json
{
   "country":"India",

   "minSalary":50000,
   "maxSalary":200000,
   "averageSalary":95000
}
```

---

### Job title metric

Requirement:

Average salary for a job title within a country

API:

```http
GET /api/v1/salary-insights/job-title
```

Query:

```http
?country=India&jobTitle=Software Engineer
```

Response:

```json
{
   "country":"India",
   "jobTitle":"Software Engineer",
   "averageSalary":120000
}
```

---

## Additional HR Metrics

Add useful metrics beyond requirements.

### Dashboard metrics

API:

```http
GET /api/v1/salary-insights/dashboard
```

Response:

```json
{
   "totalEmployees":10000,

   "highestPayingCountry":"United States",

   "highestPayingRole":"Senior Software Engineer",

   "medianSalary":85000,

   "salaryDistribution":[]
}
```

---

## Repository Requirements

Use database aggregation.

Avoid:

```ts
const employees = await findMany();

employees.reduce(...)
```

Preferred:

```ts
aggregate()

groupBy()
```

Push aggregation to Postgres.

---

## Service Tests

Create:

```ts
describe('countryInsights')

describe('jobTitleInsights')

describe('dashboardMetrics')
```

Test cases:

```ts
it('returns min salary')

it('returns max salary')

it('returns average salary')

it('returns average salary by role')

it('returns dashboard metrics')

it('handles missing country')

it('handles empty results')
```

---

## Error Handling

404:

```json
{
   "message":"Country data not found"
}
```

400:

```json
{
   "message":"Invalid request"
}
```

---

## Swagger

Document:

- params
- query values
- responses

---

## Validation

Verify:

✓ tests pass

✓ country insights work

✓ role insights work

✓ dashboard metrics work

✓ aggregation done in database

---

## Commit

Incremental commits:

```bash
git commit -m "test(api): add salary insights tests"

git commit -m "feat(api): implement salary insights service"

git commit -m "feat(api): implement salary insights endpoints"
```

---

## Notes

Avoid:

- loading 10000 employees into memory
- calculating metrics in JavaScript
- duplicate aggregation logic
