# Step 13 — Salary Dashboard & Insights UI

## Objective

Implement salary insights and HR dashboard experience.

Requirements from assessment:

Required:

✓ Minimum salary by country

✓ Maximum salary by country

✓ Average salary by country

✓ Average salary by job title in country

Additional metrics:

✓ Any meaningful HR metrics

Maintain MVC architecture.

Flow:

View
↓
Controller
↓
Hook
↓
Model
↓
API

---

## Folder Structure

Expected:

```txt
modules/dashboard/

views/

    dashboard-page.tsx

    dashboard-kpis.tsx

    country-insight-card.tsx

    salary-distribution-chart.tsx

    salary-country-chart.tsx

    job-title-insight.tsx

controllers/

    useDashboardPageController.ts

hooks/

    useDashboardMetrics.ts

    useCountryInsights.ts

    useJobTitleInsights.ts

models/

    salary-insight.api.ts

types/
```

---

## Dashboard KPIs

Display:

```txt
Total Employees

Highest Paying Country

Highest Paying Role

Median Salary
```

Use:

- Tremor Metric
- Tremor Card
- Tremor Grid

---

## Country Salary Insights

Requirements:

User selects country.

Display:

```txt
Minimum salary

Maximum salary

Average salary
```

Use:

```txt
Country dropdown
Metric cards
```

---

## Job Title Insights

Requirements:

Inputs:

```txt
Country

Job Title
```

Display:

```txt
Average salary for selected role
```

---

## Salary Distribution Visualization

Create charts:

```txt
Salary distribution by country

Employees by department
```

Recommended Tremor components:

```txt
BarChart

DonutChart

AreaChart
```

---

## Loading/Error/Empty States

All widgets should support:

✓ loading

✓ empty

✓ error

---

## Controller Responsibilities

Controller owns:

```ts
selectedCountry

selectedJobTitle

dashboard data

display-ready values
```

Views should remain declarative.

---

## React Query

Requirements:

Queries:

```txt
dashboardMetrics

countryInsights

jobTitleInsights
```

Use caching.

---

## Validation

Verify:

✓ KPI cards render

✓ country metrics update

✓ job-title metrics update

✓ charts render

✓ loading states work

✓ error states work
```

---

## Commit

```bash
git add .

git commit -m "feat(web): implement salary dashboard UI"
```
