# Step 14 — Frontend Test Refinement

## Objective

Add meaningful frontend behavior tests.

Do NOT:

- add snapshot tests
- test implementation details
- test CSS classes
- test React internals

Test behavior only.

---

## Employee Tests

Create:

```txt
modules/employees/

views/
controllers/
hooks/

__tests__/
```

Required:

```ts
✓ employee table renders

✓ loading state renders

✓ empty state renders

✓ error state renders

✓ search updates results

✓ filter updates results

✓ create employee submission works

✓ update employee submission works

✓ delete confirmation works
```

---

## Dashboard Tests

Required:

```ts
✓ KPI cards render

✓ country metrics update

✓ job-title metrics update

✓ loading state renders

✓ empty state renders

✓ chart components render
```

---

## Controller Tests

Verify:

```ts
✓ controller returns display-ready state

✓ controller mutations trigger expected actions

✓ derived values computed correctly
```

---

## Hook Tests

Verify:

```ts
✓ React Query hooks return expected data

✓ mutation invalidates cache

✓ errors handled correctly
```

---

## Coverage Target

```txt
Frontend coverage >80%

Critical flows >90%
```

Do not chase 100%.

---

## Validation

```bash
pnpm test

pnpm test:coverage
```

Expected:

✓ tests deterministic

✓ no flaky tests

✓ coverage target met
