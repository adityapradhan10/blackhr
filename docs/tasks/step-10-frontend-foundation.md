# Step 10 — Frontend Foundation

## Objective

Prepare the frontend architecture and infrastructure before implementing pages.

Goal:

Build a scalable frontend foundation that can support:

- employee management
- salary dashboards
- filtering
- analytics

Do NOT implement:

- employee pages
- CRUD forms
- charts
- dashboard widgets

Focus only on setup and architecture.

---

## Install dependencies

Install:

```bash
pnpm add -F web \
@tremor/react \
@tanstack/react-query \
react-router-dom \
axios \
zod \
react-hook-form \
@hookform/resolvers
```

Development dependencies:

```bash
pnpm add -D -F web \
tailwindcss \
@tailwindcss/vite
```

---

## Configure Tailwind

Configure:

```txt
tailwind.config.ts
```

Requirements:

- include app files
- include Tremor classes

Configure:

```txt
src/index.css
```

Include:

```css
@import "tailwindcss";
```

Verify:

✓ Tailwind utility classes work

---

## Folder Structure

Expected:

```txt
apps/web/src/

components/
hooks/
layouts/
modules/
pages/
providers/
routes/
services/
types/
utils/

modules/

    employees/

    dashboard/
```

---

## Configure React Query

Create:

```txt
providers/query-provider.tsx
```

Requirements:

Configure:

```ts
retry:1
refetchOnWindowFocus:false
staleTime:30000
```

Wrap application.

---

## Configure Routing

Create:

```txt
routes/index.tsx
```

Routes:

```txt
/

→ redirect /dashboard

/dashboard

/employees
```

Create placeholders:

```txt
pages/

dashboard-page.tsx

employees-page.tsx
```

---

## Configure API layer

Create:

```txt
services/

api.ts

employee-service.ts

salary-insight-service.ts
```

api.ts requirements:

- axios instance
- timeout
- request interceptor
- response interceptor
- environment-based URL

Example:

```env
VITE_API_URL=http://localhost:3001/api/v1
```

---

## Shared Types

Move DTOs into:

```txt
packages/shared-types
```

Create:

```ts
Employee

EmployeeResponse

DashboardMetrics

CountrySalaryInsight
```

Frontend and backend should consume shared contracts.

---

## Configure Layout

Create:

```txt
layouts/

app-layout.tsx
```

Requirements:

Simple sidebar:

```txt
Dashboard

Employees
```

No design work yet.

---

## Validation

Verify:

✓ routing works

✓ React Query configured

✓ Tailwind works

✓ Tremor works

✓ API layer works

✓ shared types compile

---

## Commit

```bash
git add .

git commit -m "feat(web): setup frontend foundation"
```

---

## Notes

Avoid:

- Redux
- Zustand
- giant components
- API calls directly inside pages
- premature component abstraction

React Query is sufficient for server state.
