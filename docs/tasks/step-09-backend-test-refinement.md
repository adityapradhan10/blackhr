# Step 09 — Backend Test Refinement

## Objective

Expand and refine backend tests to cover business behavior and edge cases.

Goal:

Increase confidence in employee management and salary insight logic before frontend development begins.

Do NOT:

- Add E2E tests
- Test framework internals
- Test Prisma itself
- Add browser tests

Focus on service behavior and business rules.

---

## Employee Service Coverage

Review and improve:

```txt
employees.service.spec.ts
```

Required scenarios:

### Create employee

```ts
✓ creates employee successfully

✓ throws duplicate email error

✓ rejects invalid salary

✓ rejects invalid input
```

---

### Get employees

```ts
✓ returns paginated result

✓ filters by country

✓ filters by department

✓ filters by jobTitle

✓ searches by fullName

✓ searches by email

✓ respects limit maximum
```

---

### Get employee by ID

```ts
✓ returns employee

✓ throws not found
```

---

### Update employee

```ts
✓ updates employee

✓ throws not found

✓ rejects invalid updates
```

---

### Delete employee

```ts
✓ deletes employee

✓ throws not found
```

---

## Salary Insight Coverage

Review:

```txt
salary-insights.service.spec.ts
```

Required scenarios:

### Country insights

```ts
✓ min salary calculation

✓ max salary calculation

✓ average salary calculation

✓ country not found
```

---

### Job title insights

```ts
✓ average salary for role

✓ empty result handling
```

---

### Dashboard metrics

```ts
✓ total employees

✓ highest paying country

✓ highest paying role

✓ median salary
```

---

## Seed System Coverage

Create:

```txt
prisma/seed/employee-generator.spec.ts
```

Verify:

```ts
✓ generates 10000 employees

✓ emails are unique

✓ employeeIds are unique

✓ salary ranges are valid

✓ generated records are deterministic
```

---

## Coverage Goals

Target:

```txt
Service coverage: >85%

Critical business logic: >90%
```

Do not chase 100%.

Coverage should reflect meaningful behavior.

---

## Validation

Verify:

```bash
pnpm test

pnpm test:coverage
```

Expected:

✓ all tests pass

✓ deterministic results

✓ coverage target reached
```

---

## Commit

```bash
git add .

git commit -m "test(api): improve backend business coverage"
```
