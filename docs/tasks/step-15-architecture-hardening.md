Perform a complete architecture hardening review.

Do NOT implement new features.

Do NOT redesign the application.

Only inspect and fix deviations.

Review:

# React Architecture

Verify:

✓ View → Controller → Hook → Model → API flow

✓ no upward dependency violations

✓ no cross-module imports

✓ no API calls inside views

✓ no business logic inside views

✓ controllers only orchestrate

✓ hooks only contain React Query logic

✓ models only perform data access

✓ storage isolated

---

# Styling

Verify:

✓ Tailwind utilities consistent

✓ Tremor usage consistent

✓ no inline styles

✓ avoid duplicated class strings

✓ reusable UI patterns extracted

✓ responsive behavior

✓ loading states consistent

✓ empty states consistent

✓ error states consistent

---

# Component Design

Verify:

✓ components have single responsibility

✓ no giant components (>300 lines preferred)

✓ form logic isolated

✓ table logic isolated

✓ dialog logic isolated

---

# Type Safety

Verify:

✓ no any

✓ no duplicate interfaces

✓ shared contracts used everywhere

✓ Zod forms aligned with shared types

---

# React Query

Verify:

✓ query keys centralized

✓ invalidation consistent

✓ no duplicate queries

✓ staleTime reasonable

✓ retry behavior appropriate

---

# Backend

Verify:

✓ controller → service → repository flow

✓ no Prisma leakage into controllers

✓ DTO validation isolated

✓ aggregation done in database

---

# Performance

Verify:

✓ no unnecessary rerenders

✓ useMemo/useCallback only where useful

✓ pagination server-side

✓ search debounced

✓ charts do not recompute unnecessarily

---

Output:

1. High severity findings
2. Medium findings
3. Low findings
4. Suggested fixes
5. Architecture score /10
