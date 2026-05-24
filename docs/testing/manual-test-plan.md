# Manual Test Plan — BlackHR UI (Positive Cases)

## Purpose

This document is the **positive-path manual test plan** for the BlackHR web application. It is written for a QA agent (human or automated) to execute end-to-end UI verification before release or submission.

**In scope:** All user-visible happy-path flows — navigation, dashboard analytics, employee list operations, CRUD, filters, sorting, pagination, charts, modals, and responsive layout.

**Out of scope for this document:** Negative validation, API failure handling, and edge-case error recovery (covered separately if needed).

---

## QA Agent Instructions

1. Execute tests in the order listed unless a precondition block says otherwise.
2. Mark each test **PASS** only if **every** expected result is true.
3. Record evidence for failures: screenshot, browser console errors, and failing network request (URL + status).
4. Use a desktop browser first (Chrome or Firefox recommended), then repeat responsive checks in Section 8.
5. Keep DevTools **Console** and **Network** tabs open for the full run.
6. Do not modify application code during the test run.

### Reporting Template

```txt
Test ID: TC-UI-XXX
Result: PASS | FAIL
Browser: ...
Viewport: ...
Notes: ...
```

---

## Environment & Preconditions

### Required services

| Service   | URL / command                                      | Expected state        |
| --------- | -------------------------------------------------- | --------------------- |
| Frontend  | http://localhost:5173                              | Running               |
| API       | http://localhost:3001/api/v1                       | Running               |
| Database  | SQLite (`apps/api/dev.db`)                         | Migrated and seeded   |

### Setup (run once before UI tests)

```bash
# From repo root
pnpm install
cp apps/api/.env.example apps/api/.env   # if not already done
pnpm -F @blackhr/api exec prisma migrate dev
pnpm -F @blackhr/api exec prisma db seed
pnpm dev
```

**Seed expectations:**

- 10,000 employees inserted
- No duplicate emails
- No duplicate `employeeId` values
- Re-running seed completes without error and employee count remains 10,000

### Health check

```http
GET http://localhost:3001/api/v1/health
```

Expected response:

```json
{ "status": "ok" }
```

### Application routes

| Route        | Page       | Default redirect |
| ------------ | ---------- | ---------------- |
| `/`          | —          | Redirects to `/dashboard` |
| `/dashboard` | Dashboard  | —                |
| `/employees` | Employees  | —                |

### Reference data (dropdown options)

**Countries:** India, United States, United Kingdom, Germany, Canada

**Departments:** Engineering, Product, Design, Sales, HR, Finance

**Job titles:** Software Engineer, Product Manager, Designer, Sales Executive, HR Manager

**Employment types:** Full Time, Part Time, Contract

**Pagination:** 20 employees per page (500 pages with full seed)

**Search debounce:** ~300 ms after typing stops

---

# 1. Application Shell & Navigation

## TC-UI-001 — App loads at root and redirects to dashboard

**Priority:** P0

**Steps:**

1. Open http://localhost:5173/
2. Wait for the page to finish loading.

**Expected:**

- [ ] URL becomes `/dashboard`
- [ ] Page heading **Dashboard** is visible
- [ ] No uncaught errors in the browser console
- [ ] No failed network requests (4xx/5xx) on initial load

---

## TC-UI-002 — Sidebar branding and layout render

**Priority:** P1

**Steps:**

1. On any authenticated route (Dashboard or Employees), inspect the left sidebar.

**Expected:**

- [ ] App name **BlackHR** is visible
- [ ] Subtitle **Salary management** is visible
- [ ] Main content area renders to the right of the sidebar
- [ ] Page background uses a light slate layout (no broken/unstyled layout)

---

## TC-UI-003 — Main navigation links are present

**Priority:** P0

**Steps:**

1. Load `/dashboard`.
2. Locate the main navigation (`aria-label="Main navigation"`).

**Expected:**

- [ ] Link **Dashboard** is visible
- [ ] Link **Employees** is visible

---

## TC-UI-004 — Navigate to Employees via sidebar

**Priority:** P0

**Steps:**

1. From `/dashboard`, click **Employees** in the sidebar.

**Expected:**

- [ ] URL is `/employees`
- [ ] Page heading **Employees** is visible
- [ ] Page description mentions managing employee records
- [ ] **Add Employee** button is visible

---

## TC-UI-005 — Navigate to Dashboard via sidebar

**Priority:** P0

**Steps:**

1. From `/employees`, click **Dashboard** in the sidebar.

**Expected:**

- [ ] URL is `/dashboard`
- [ ] Page heading **Dashboard** is visible
- [ ] KPI section loads (see Section 3)

---

## TC-UI-006 — Active navigation link is highlighted

**Priority:** P2

**Steps:**

1. Visit `/dashboard` — note Dashboard link styling.
2. Visit `/employees` — note Employees link styling.

**Expected:**

- [ ] On `/dashboard`, the Dashboard link appears active (indigo highlight)
- [ ] On `/employees`, the Employees link appears active
- [ ] Only one nav link is active at a time

---

## TC-UI-007 — Direct URL navigation to Employees

**Priority:** P1

**Steps:**

1. Enter http://localhost:5173/employees in the address bar and press Enter.

**Expected:**

- [ ] Employees page loads without manual navigation
- [ ] Employee table or loading state appears
- [ ] Sidebar **Employees** link is active

---

## TC-UI-008 — Direct URL navigation to Dashboard

**Priority:** P1

**Steps:**

1. Enter http://localhost:5173/dashboard in the address bar and press Enter.

**Expected:**

- [ ] Dashboard page loads
- [ ] KPI cards and insight widgets appear after loading

---

# 2. Dashboard — Page Load & KPIs

## TC-UI-010 — Dashboard page header

**Priority:** P1

**Steps:**

1. Open `/dashboard`.

**Expected:**

- [ ] Heading **Dashboard** is visible
- [ ] Description **Organization-wide salary metrics and workforce insights** is visible

---

## TC-UI-011 — Dashboard loading state

**Priority:** P2

**Steps:**

1. Hard-refresh `/dashboard` (Ctrl+Shift+R / Cmd+Shift+R).
2. Observe the first paint before data loads.

**Expected:**

- [ ] A loading message **Loading dashboard...** appears briefly (`aria-label="Loading dashboard"`)
- [ ] Loading state is replaced by dashboard content without user action

---

## TC-UI-012 — Total Employees KPI

**Priority:** P0

**Steps:**

1. On `/dashboard`, locate the **Total Employees** KPI card.

**Expected:**

- [ ] Card title **Total Employees** is visible
- [ ] Value is a formatted number (e.g. `10,000` with seeded data)
- [ ] Value is not `—` or blank

---

## TC-UI-013 — Highest Paying Country KPI

**Priority:** P0

**Steps:**

1. Locate the **Highest Paying Country** KPI card.

**Expected:**

- [ ] Card title is visible
- [ ] Value shows a country name (not empty, not `—`)

---

## TC-UI-014 — Highest Paying Role KPI

**Priority:** P0

**Steps:**

1. Locate the **Highest Paying Role** KPI card.

**Expected:**

- [ ] Card title is visible
- [ ] Value shows a job title / role name

---

## TC-UI-015 — Median Salary KPI

**Priority:** P0

**Steps:**

1. Locate the **Median Salary** KPI card.

**Expected:**

- [ ] Card title is visible
- [ ] Value is formatted as USD currency (e.g. `$85,000`)
- [ ] Value uses comma grouping and no decimal cents

---

## TC-UI-016 — All four KPI cards render in a grid

**Priority:** P1

**Steps:**

1. View the KPI row on a desktop-width viewport (≥ 1024 px).

**Expected:**

- [ ] Four KPI cards are visible: Total Employees, Highest Paying Country, Highest Paying Role, Median Salary
- [ ] Cards are evenly laid out without overlap or horizontal scroll on the main content area

---

# 3. Dashboard — Country Salary Insights

## TC-UI-020 — Country insight card renders

**Priority:** P0

**Steps:**

1. On `/dashboard`, scroll to **Country Salary Insights**.

**Expected:**

- [ ] Section title **Country Salary Insights** is visible
- [ ] Subtitle mentions comparing salary ranges for a selected country
- [ ] Country dropdown is visible (`data-testid="dashboard-country-select"`)

---

## TC-UI-021 — Default country insight metrics display

**Priority:** P0

**Steps:**

1. After dashboard load, read the three stat blocks under Country Salary Insights.

**Expected:**

- [ ] **Minimum salary** shows a USD currency value
- [ ] **Maximum salary** shows a USD currency value
- [ ] **Average salary** shows a USD currency value
- [ ] Min ≤ Average ≤ Max (logical ordering)

---

## TC-UI-022 — Change country in Country Salary Insights

**Priority:** P0

**Steps:**

1. Note current min / max / average values for the default country (India).
2. Open the country dropdown and select **United States**.
3. Wait for metrics to update.

**Expected:**

- [ ] Dropdown shows **United States** as selected
- [ ] Min, max, and average salary values update
- [ ] At least one value differs from the previous country
- [ ] No error message appears in the card

---

## TC-UI-023 — Country insight supports all country options

**Priority:** P1

**Steps:**

For each country in the dropdown — **India**, **United States**, **United Kingdom**, **Germany**, **Canada**:

1. Select the country.
2. Wait for loading to finish.

**Expected (per country):**

- [ ] Metrics load without error
- [ ] Min, max, and average are all populated with currency values

---

# 4. Dashboard — Job Title Salary Insights

## TC-UI-030 — Job title insight card renders

**Priority:** P0

**Steps:**

1. On `/dashboard`, locate **Job Title Salary Insights**.

**Expected:**

- [ ] Section title is visible
- [ ] Subtitle mentions average compensation by role and country
- [ ] Country dropdown visible (`data-testid="dashboard-job-title-country-select"`)
- [ ] Job title dropdown visible (`data-testid="dashboard-job-title-select"`)

---

## TC-UI-031 — Default job title average salary displays

**Priority:** P0

**Steps:**

1. After dashboard load, read **Average salary for selected role**.

**Expected:**

- [ ] A USD currency value is shown (default: Software Engineer in India)
- [ ] Value is not blank or `—`

---

## TC-UI-032 — Change job title updates average salary

**Priority:** P0

**Steps:**

1. Note the current average salary.
2. Change job title to **Product Manager** (keep country as **India**).
3. Wait for update.

**Expected:**

- [ ] **Product Manager** is selected in the dropdown
- [ ] Average salary value updates
- [ ] No error message in the card

---

## TC-UI-033 — Change country in job title insight updates average

**Priority:** P0

**Steps:**

1. Set job title to **Software Engineer**.
2. Set country to **United States**.
3. Wait for update.

**Expected:**

- [ ] Average salary updates for the United States + Software Engineer combination
- [ ] No error message

---

## TC-UI-034 — Job title insight supports all job title options

**Priority:** P1

**Steps:**

With country set to **India**, select each job title:

- Software Engineer
- Product Manager
- Designer
- Sales Executive
- HR Manager

**Expected (per title):**

- [ ] Average salary loads and displays as currency

---

# 5. Dashboard — Charts

## TC-UI-040 — Salary Distribution by Country chart renders

**Priority:** P0

**Steps:**

1. On `/dashboard`, locate **Salary Distribution by Country** (`data-testid="salary-country-chart"`).

**Expected:**

- [ ] Chart title and subtitle are visible
- [ ] Bar chart renders with bars for operating countries
- [ ] X-axis shows country names
- [ ] Y-axis shows formatted salary values

---

## TC-UI-041 — Country chart tooltip on hover

**Priority:** P2

**Steps:**

1. Hover over a bar in the country salary chart.

**Expected:**

- [ ] Tooltip appears showing country and average salary
- [ ] Tooltip value is formatted as currency

---

## TC-UI-042 — Employees by Department chart renders

**Priority:** P0

**Steps:**

1. Locate **Employees by Department** (`data-testid="department-distribution-chart"`).

**Expected:**

- [ ] Chart title and subtitle are visible
- [ ] Donut/pie chart renders with colored segments
- [ ] Center label shows **Total** with employee count
- [ ] Legend below chart lists department names with color swatches

---

## TC-UI-043 — Department chart total matches KPI

**Priority:** P1

**Steps:**

1. Read **Total Employees** from the center of the department chart.
2. Compare with the **Total Employees** KPI card.

**Expected:**

- [ ] Both totals show the same formatted count (e.g. `10,000`)

---

## TC-UI-044 — Department chart tooltip on hover

**Priority:** P2

**Steps:**

1. Hover over a segment in the department chart.

**Expected:**

- [ ] Tooltip shows department label and employee count

---

## TC-UI-045 — Dashboard charts layout on wide screen

**Priority:** P2

**Steps:**

1. On viewport ≥ 1280 px, view the two chart cards side by side.

**Expected:**

- [ ] Country chart and department chart appear in a two-column grid
- [ ] Neither chart is clipped or overflows its card

---

# 6. Employees — List & Table

## TC-UI-050 — Employees page header and primary action

**Priority:** P0

**Steps:**

1. Open `/employees`.

**Expected:**

- [ ] Heading **Employees** is visible
- [ ] Description about managing employee records is visible
- [ ] **Add Employee** button is visible in the page header

---

## TC-UI-051 — Employee table loading state

**Priority:** P2

**Steps:**

1. Hard-refresh `/employees`.

**Expected:**

- [ ] **Loading employees...** message appears briefly (`aria-label="Loading employees"`)
- [ ] Table replaces loading state when data arrives

---

## TC-UI-052 — Employee table columns

**Priority:** P0

**Steps:**

1. Wait for the employee table to load with seeded data.

**Expected:**

- [ ] Table headers present: Employee ID, Name, Email, Department, Country, Job Title, Salary, Employment Type, Actions
- [ ] At least one data row is visible
- [ ] Each row shows **Edit** and **Delete** action buttons

---

## TC-UI-053 — Employee ID format in table

**Priority:** P1

**Steps:**

1. Inspect the **Employee ID** column for visible rows.

**Expected:**

- [ ] IDs follow a consistent format (e.g. `BHR-00001`)
- [ ] IDs are unique within the visible page

---

## TC-UI-054 — Salary formatting in table

**Priority:** P1

**Steps:**

1. Inspect the **Salary** column.

**Expected:**

- [ ] Values are formatted as USD currency (e.g. `$120,000`)
- [ ] No raw unformatted numbers

---

## TC-UI-055 — Employment type badge in table

**Priority:** P1

**Steps:**

1. Inspect the **Employment Type** column.

**Expected:**

- [ ] Values display as human-readable badges: **Full Time**, **Part Time**, or **Contract**
- [ ] Badge styling is visible (blue badge)

---

## TC-UI-056 — Pagination controls visible with seeded data

**Priority:** P0

**Steps:**

1. On `/employees` with 10,000 seeded employees, scroll below the table.

**Expected:**

- [ ] **Previous** and **Next** buttons are visible
- [ ] Page indicator shows **Page 1 of 500** (or equivalent based on total)
- [ ] **Previous** is disabled on page 1

---

## TC-UI-057 — Navigate to next page

**Priority:** P0

**Steps:**

1. Note an employee name on page 1.
2. Click **Next**.

**Expected:**

- [ ] Page indicator updates to **Page 2 of …**
- [ ] Table rows change (different employees than page 1)
- [ ] **Previous** becomes enabled

---

## TC-UI-058 — Navigate back to previous page

**Priority:** P0

**Steps:**

1. From page 2, click **Previous**.

**Expected:**

- [ ] Page indicator returns to **Page 1 of …**
- [ ] Original page 1 employees reappear
- [ ] **Previous** is disabled again

---

## TC-UI-059 — Next disabled on last page

**Priority:** P1

**Steps:**

1. Navigate to the last page (page 500 with full seed, or use repeated **Next** until disabled).

**Expected:**

- [ ] **Next** button is disabled on the last page
- [ ] Page indicator shows the last page number

---

# 7. Employees — Search & Filters

## TC-UI-060 — Search input is present

**Priority:** P0

**Steps:**

1. On `/employees`, locate the filters panel.

**Expected:**

- [ ] Search field labeled **Search employees** is visible
- [ ] Placeholder text: **Search by name or email**
- [ ] Input has `role="searchbox"`

---

## TC-UI-061 — Search by employee name

**Priority:** P0

**Steps:**

1. Pick a known employee name from page 1 (e.g. first visible **Name** value).
2. Type the full name (or distinctive substring) into search.
3. Wait ~300 ms after typing stops.

**Expected:**

- [ ] Table updates to show matching employees
- [ ] Visible rows include the searched name
- [ ] Non-matching employees from the previous unfiltered view are gone
- [ ] Page resets to page 1

---

## TC-UI-062 — Search by email

**Priority:** P0

**Steps:**

1. Clear search.
2. Type a known email from a visible employee row.
3. Wait for debounce.

**Expected:**

- [ ] Matching employee appears by email
- [ ] Non-matching rows are not shown

---

## TC-UI-063 — Clear search restores full list

**Priority:** P1

**Steps:**

1. Run a search that narrows results.
2. Clear the search input completely.
3. Wait for debounce.

**Expected:**

- [ ] Full paginated list returns
- [ ] Page indicator reflects unfiltered total pages

---

## TC-UI-064 — Filter by country

**Priority:** P0

**Steps:**

1. Clear search and reset filters to **All countries**.
2. Open **Country** filter (`data-testid="filter-country"`) and select **India**.

**Expected:**

- [ ] All visible rows show **India** in the Country column
- [ ] Page resets to 1

---

## TC-UI-065 — Filter by department

**Priority:** P0

**Steps:**

1. Reset country filter to **All countries**.
2. Select **Engineering** in the **Department** filter.

**Expected:**

- [ ] All visible rows show **Engineering** in the Department column

---

## TC-UI-066 — Filter by job title

**Priority:** P0

**Steps:**

1. Reset other filters.
2. Select **Software Engineer** in the **Job Title** filter.

**Expected:**

- [ ] All visible rows show **Software Engineer** in the Job Title column

---

## TC-UI-067 — Combined filters (country + department + job title)

**Priority:** P0

**Steps:**

1. Set **Country** = **India**
2. Set **Department** = **Engineering**
3. Set **Job Title** = **Software Engineer**

**Expected:**

- [ ] Every visible row matches all three filter values
- [ ] If no employees match, empty state is shown (see TC-UI-068)

---

## TC-UI-068 — Empty state when no employees match

**Priority:** P1

**Steps:**

1. Apply a search string that matches no employees (e.g. `zzzznonexistent999`).

**Expected:**

- [ ] Message **No employees found.** is displayed
- [ ] Table body is not shown
- [ ] Application remains stable (no crash)

---

## TC-UI-069 — Reset filters to show all employees

**Priority:** P1

**Steps:**

1. After applying filters, set each dropdown back to:
   - **All countries**
   - **All departments**
   - **All job titles**
2. Clear search.

**Expected:**

- [ ] Full employee list returns with default pagination

---

## TC-UI-070 — Search combined with filters

**Priority:** P1

**Steps:**

1. Set **Country** = **United States**.
2. Search for a partial name known to exist in that country (pick from filtered results).

**Expected:**

- [ ] Results satisfy both the country filter and the search term

---

# 8. Employees — Sorting

Sortable columns: **Name**, **Country**, **Job Title**, **Salary** (click column header button).

## TC-UI-080 — Sort by Name ascending

**Priority:** P0

**Steps:**

1. Reset filters and search.
2. Click **Sort by Name** column header once.

**Expected:**

- [ ] Column header shows ascending sort state (`aria-sort="ascending"`)
- [ ] Names appear in ascending alphabetical order on the current page
- [ ] Page resets to 1

---

## TC-UI-081 — Sort by Name toggles to descending

**Priority:** P0

**Steps:**

1. With Name sort active, click **Sort by Name** again.

**Expected:**

- [ ] `aria-sort="descending"` on Name column
- [ ] Name order reverses compared to ascending

---

## TC-UI-082 — Sort by Salary ascending

**Priority:** P0

**Steps:**

1. Click **Sort by Salary** header.

**Expected:**

- [ ] Salaries on the page appear in ascending order
- [ ] Sort indicator active on Salary column

---

## TC-UI-083 — Sort by Salary descending

**Priority:** P0

**Steps:**

1. Click **Sort by Salary** twice (asc then desc).

**Expected:**

- [ ] Salaries appear in descending order on the page

---

## TC-UI-084 — Sort by Country

**Priority:** P1

**Steps:**

1. Click **Sort by Country** header.

**Expected:**

- [ ] Rows reorder by country alphabetically (ascending first click)
- [ ] Sort indicator moves to Country column

---

## TC-UI-085 — Sort by Job Title

**Priority:** P1

**Steps:**

1. Click **Sort by Job Title** header.

**Expected:**

- [ ] Rows reorder by job title alphabetically
- [ ] Sort indicator moves to Job Title column

---

## TC-UI-086 — Switch sort column resets order to ascending

**Priority:** P2

**Steps:**

1. Sort by Salary descending.
2. Click **Sort by Name**.

**Expected:**

- [ ] Name column becomes active sort
- [ ] Sort order starts ascending on the new column

---

# 9. Employees — Create (Add Employee)

## TC-UI-090 — Open Add Employee modal

**Priority:** P0

**Steps:**

1. On `/employees`, click **Add Employee**.

**Expected:**

- [ ] Modal dialog opens (`role="dialog"`)
- [ ] Title **Add Employee** is visible
- [ ] Description mentions adding a new employee
- [ ] Form fields are visible (see TC-UI-091)
- [ ] **Cancel** and **Save Employee** buttons are visible

---

## TC-UI-091 — Create form fields present

**Priority:** P0

**Steps:**

1. With Add Employee modal open, verify all fields.

**Expected:**

- [ ] Full Name (text)
- [ ] Email (text)
- [ ] Department (select)
- [ ] Country (select)
- [ ] Job Title (select)
- [ ] Salary (number)
- [ ] Employment Type (select, default Full Time)
- [ ] Joining Date (date)

---

## TC-UI-092 — Create employee with valid data (Full Time)

**Priority:** P0

**Steps:**

1. Click **Add Employee**.
2. Fill the form:

   | Field            | Value                              |
   | ---------------- | ---------------------------------- |
   | Full Name        | QA Test User                       |
   | Email            | qa.test.user@blackhr.example       |
   | Department       | Engineering                        |
   | Country          | India                              |
   | Job Title        | Software Engineer                  |
   | Salary           | 95000                              |
   | Employment Type  | Full Time                          |
   | Joining Date     | 2024-06-01                         |

3. Click **Save Employee**.

**Expected:**

- [ ] Modal closes
- [ ] Green success banner: **Employee created successfully.**
- [ ] New employee appears in the table when searched by name or email
- [ ] Table row shows correct department, country, job title, salary, and **Full Time** badge

---

## TC-UI-093 — Create employee with Part Time employment type

**Priority:** P1

**Steps:**

1. Add employee with unique email `qa.parttime@blackhr.example`.
2. Set **Employment Type** = **Part Time**.
3. Submit with otherwise valid data.

**Expected:**

- [ ] Success message shown
- [ ] Employee row shows **Part Time** badge

---

## TC-UI-094 — Create employee with Contract employment type

**Priority:** P1

**Steps:**

1. Add employee with unique email `qa.contract@blackhr.example`.
2. Set **Employment Type** = **Contract**.
3. Submit.

**Expected:**

- [ ] Success message shown
- [ ] Employee row shows **Contract** badge

---

## TC-UI-095 — Cancel create form without saving

**Priority:** P1

**Steps:**

1. Click **Add Employee**.
2. Enter partial data.
3. Click **Cancel**.

**Expected:**

- [ ] Modal closes
- [ ] No success message
- [ ] No new employee created (verify by search)

---

## TC-UI-096 — Create employee in each supported country

**Priority:** P2

**Steps:**

For each country (use unique emails per run):

1. Create one employee with that country selected.
2. Verify row appears with correct country.

**Expected:**

- [ ] Employee created successfully for India, United States, United Kingdom, Germany, and Canada

---

# 10. Employees — Update (Edit Employee)

## TC-UI-100 — Open Edit Employee modal

**Priority:** P0

**Steps:**

1. On an employee row, click **Edit** (button label: `Edit {fullName}`).

**Expected:**

- [ ] Modal title **Edit Employee** is visible
- [ ] Description mentions updating employee details
- [ ] Form is pre-filled with the employee's current values
- [ ] Submit button reads **Save Changes**

---

## TC-UI-101 — Update employee name and salary

**Priority:** P0

**Steps:**

1. Edit the employee created in TC-UI-092 (or any test employee).
2. Change **Full Name** to `QA Test User Updated`.
3. Change **Salary** to `105000`.
4. Click **Save Changes**.

**Expected:**

- [ ] Modal closes
- [ ] Success banner: **Employee updated successfully.**
- [ ] Table reflects updated name and salary when searched

---

## TC-UI-102 — Update employee department and job title

**Priority:** P1

**Steps:**

1. Edit a test employee.
2. Change **Department** to **Product** and **Job Title** to **Product Manager**.
3. Save.

**Expected:**

- [ ] Success message shown
- [ ] Updated values visible in the table row

---

## TC-UI-103 — Update employment type via edit

**Priority:** P1

**Steps:**

1. Edit a test employee.
2. Change **Employment Type** from Full Time to Part Time (or vice versa).
3. Save.

**Expected:**

- [ ] Badge in table updates to the new employment type

---

## TC-UI-104 — Cancel edit without saving

**Priority:** P1

**Steps:**

1. Open edit on an employee.
2. Change a field.
3. Click **Cancel**.

**Expected:**

- [ ] Modal closes
- [ ] Original values unchanged in the table

---

# 11. Employees — Delete

## TC-UI-110 — Open delete confirmation dialog

**Priority:** P0

**Steps:**

1. Click **Delete** on a test employee row (created during this test run).

**Expected:**

- [ ] Modal opens with title **Delete employee**
- [ ] Description asks for confirmation and includes the employee's full name
- [ ] **Cancel** and **Confirm Delete** buttons are visible

---

## TC-UI-111 — Cancel delete keeps employee

**Priority:** P0

**Steps:**

1. Open delete dialog for a test employee.
2. Click **Cancel**.

**Expected:**

- [ ] Dialog closes
- [ ] Employee still appears in the table

---

## TC-UI-112 — Confirm delete removes employee

**Priority:** P0

**Steps:**

1. Note the employee name/email.
2. Click **Delete**, then **Confirm Delete**.
3. Wait for operation to complete.

**Expected:**

- [ ] Dialog closes
- [ ] Success banner: **Employee deleted successfully.**
- [ ] Employee no longer appears when searched by name or email

---

## TC-UI-113 — Delete button shows loading state

**Priority:** P2

**Steps:**

1. Open delete confirmation and click **Confirm Delete**.
2. Observe the button during the request.

**Expected:**

- [ ] Button text changes to **Deleting...**
- [ ] Button is disabled while deletion is in progress

---

# 12. Modals & Accessibility (Positive UX)

## TC-UI-120 — Modal scroll for long form on small viewport

**Priority:** P2

**Steps:**

1. Set viewport height to ~600 px.
2. Open Add Employee modal.

**Expected:**

- [ ] Modal is scrollable if content exceeds viewport
- [ ] Submit and Cancel remain reachable
- [ ] Background page does not scroll behind modal (body scroll locked)

---

## TC-UI-121 — Sort buttons have accessible labels

**Priority:** P2

**Steps:**

1. On `/employees`, inspect sortable column headers.

**Expected:**

- [ ] Each sortable header has `aria-label` like **Sort by Name**, **Sort by Salary**, etc.

---

## TC-UI-122 — Success feedback uses status role

**Priority:** P2

**Steps:**

1. Perform a create, update, or delete that succeeds.

**Expected:**

- [ ] Green success message has `role="status"` for screen readers

---

# 13. Responsive Layout (Positive)

Run on `/dashboard` and `/employees`.

## TC-UI-130 — Desktop layout (≥ 1280 px)

**Priority:** P1

**Steps:**

1. Set viewport to 1440 × 900.
2. Visit dashboard and employees pages.

**Expected:**

- [ ] Sidebar remains visible
- [ ] Dashboard insight cards and charts use multi-column layout
- [ ] Employee filters use grid layout (up to 4 columns)
- [ ] Table is horizontally scrollable inside its card if needed, without breaking the shell

---

## TC-UI-131 — Tablet layout (~768 px)

**Priority:** P1

**Steps:**

1. Set viewport to 768 × 1024.
2. Visit dashboard and employees pages.

**Expected:**

- [ ] Sidebar and content stack or adapt without overlap
- [ ] KPI cards wrap to two columns
- [ ] Filters remain usable
- [ ] Modals fit within viewport with padding

---

## TC-UI-132 — Mobile layout (~375 px)

**Priority:** P1

**Steps:**

1. Set viewport to 375 × 812.
2. Visit dashboard and employees pages.
3. Open Add Employee modal.

**Expected:**

- [ ] No horizontal overflow on page shell
- [ ] Navigation links remain tappable
- [ ] Table remains usable (scroll or readable layout)
- [ ] Modal renders full-width with readable form fields

---

# 14. Final Smoke Checklist

After all UI tests, verify:

- [ ] No uncaught errors in browser console during the full run
- [ ] No unexpected 4xx/5xx API responses during happy-path flows
- [ ] All routes (`/`, `/dashboard`, `/employees`) resolve correctly
- [ ] No visible layout overflow or broken components
- [ ] Test employees created during the run were deleted or left documented (optional cleanup)

---

## Appendix A — Suggested Test Data Cleanup

If test employees were created (TC-UI-092 through TC-UI-096), delete them via the UI or leave for the next run with unique emails.

Suggested emails used in this plan:

- `qa.test.user@blackhr.example`
- `qa.parttime@blackhr.example`
- `qa.contract@blackhr.example`

---

## Appendix B — Infrastructure Verification (Non-UI)

These checks support UI testing but are not UI interactions.

### API starts successfully

```bash
pnpm --filter api dev
```

```http
GET /api/v1/health
→ { "status": "ok" }
```

### Seed verification

```bash
pnpm --filter api prisma db seed
```

- 10,000 employees inserted
- Repeat seed: no failures, count remains 10,000

### Frontend dev server

```bash
pnpm dev
```

- Frontend loads at http://localhost:5173
- Dashboard route opens by default

---

## Appendix C — Test Case Index

| ID        | Area                          | Priority |
| --------- | ----------------------------- | -------- |
| TC-UI-001 | Root redirect                 | P0       |
| TC-UI-002 | Sidebar branding              | P1       |
| TC-UI-003 | Nav links present             | P0       |
| TC-UI-004 | Nav to Employees              | P0       |
| TC-UI-005 | Nav to Dashboard              | P0       |
| TC-UI-006 | Active nav state              | P2       |
| TC-UI-007 | Direct URL Employees          | P1       |
| TC-UI-008 | Direct URL Dashboard          | P1       |
| TC-UI-010 | Dashboard header              | P1       |
| TC-UI-011 | Dashboard loading             | P2       |
| TC-UI-012 | Total Employees KPI           | P0       |
| TC-UI-013 | Highest Paying Country KPI    | P0       |
| TC-UI-014 | Highest Paying Role KPI       | P0       |
| TC-UI-015 | Median Salary KPI             | P0       |
| TC-UI-016 | KPI grid layout               | P1       |
| TC-UI-020 | Country insight card          | P0       |
| TC-UI-021 | Default country metrics       | P0       |
| TC-UI-022 | Change country insight        | P0       |
| TC-UI-023 | All country options           | P1       |
| TC-UI-030 | Job title insight card        | P0       |
| TC-UI-031 | Default job title average     | P0       |
| TC-UI-032 | Change job title              | P0       |
| TC-UI-033 | Change country in job insight | P0       |
| TC-UI-034 | All job title options         | P1       |
| TC-UI-040 | Country bar chart             | P0       |
| TC-UI-041 | Country chart tooltip         | P2       |
| TC-UI-042 | Department pie chart          | P0       |
| TC-UI-043 | Chart total vs KPI            | P1       |
| TC-UI-044 | Department chart tooltip      | P2       |
| TC-UI-045 | Charts wide layout            | P2       |
| TC-UI-050 | Employees header              | P0       |
| TC-UI-051 | Table loading                 | P2       |
| TC-UI-052 | Table columns                 | P0       |
| TC-UI-053 | Employee ID format            | P1       |
| TC-UI-054 | Salary formatting             | P1       |
| TC-UI-055 | Employment badge              | P1       |
| TC-UI-056 | Pagination visible            | P0       |
| TC-UI-057 | Next page                     | P0       |
| TC-UI-058 | Previous page                 | P0       |
| TC-UI-059 | Last page Next disabled       | P1       |
| TC-UI-060 | Search input                  | P0       |
| TC-UI-061 | Search by name                | P0       |
| TC-UI-062 | Search by email               | P0       |
| TC-UI-063 | Clear search                  | P1       |
| TC-UI-064 | Filter country                | P0       |
| TC-UI-065 | Filter department             | P0       |
| TC-UI-066 | Filter job title              | P0       |
| TC-UI-067 | Combined filters              | P0       |
| TC-UI-068 | Empty state                   | P1       |
| TC-UI-069 | Reset filters                 | P1       |
| TC-UI-070 | Search + filters              | P1       |
| TC-UI-080 | Sort name asc                 | P0       |
| TC-UI-081 | Sort name desc                | P0       |
| TC-UI-082 | Sort salary asc               | P0       |
| TC-UI-083 | Sort salary desc              | P0       |
| TC-UI-084 | Sort country                  | P1       |
| TC-UI-085 | Sort job title                | P1       |
| TC-UI-086 | Switch sort column            | P2       |
| TC-UI-090 | Open add modal                | P0       |
| TC-UI-091 | Create form fields            | P0       |
| TC-UI-092 | Create Full Time              | P0       |
| TC-UI-093 | Create Part Time              | P1       |
| TC-UI-094 | Create Contract               | P1       |
| TC-UI-095 | Cancel create                 | P1       |
| TC-UI-096 | Create all countries          | P2       |
| TC-UI-100 | Open edit modal               | P0       |
| TC-UI-101 | Update name/salary            | P0       |
| TC-UI-102 | Update dept/title             | P1       |
| TC-UI-103 | Update employment type        | P1       |
| TC-UI-104 | Cancel edit                   | P1       |
| TC-UI-110 | Open delete dialog            | P0       |
| TC-UI-111 | Cancel delete                 | P0       |
| TC-UI-112 | Confirm delete                | P0       |
| TC-UI-113 | Delete loading state          | P2       |
| TC-UI-120 | Modal scroll                  | P2       |
| TC-UI-121 | Sort a11y labels              | P2       |
| TC-UI-122 | Success status role           | P2       |
| TC-UI-130 | Desktop responsive            | P1       |
| TC-UI-131 | Tablet responsive             | P1       |
| TC-UI-132 | Mobile responsive             | P1       |

**Total: 72 positive UI test cases**
