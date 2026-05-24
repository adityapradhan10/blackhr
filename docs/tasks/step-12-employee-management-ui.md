# Step 12 — Employee Management UI

## Objective

Implement the employee management experience.

Requirements:

- Add employee
- View employees
- Update employees
- Delete employees

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

Do NOT bypass layers.

---

## Folder Structure

Expected:

```txt
modules/employees/

views/

    employees-page.tsx

    employee-table.tsx

    employee-form.tsx

    employee-filters.tsx

    employee-delete-dialog.tsx

controllers/

    useEmployeesPageController.ts

    useEmployeeFormController.ts

hooks/

    useEmployees.ts

    useCreateEmployee.ts

    useUpdateEmployee.ts

    useDeleteEmployee.ts

models/

    employee.api.ts

types/
```

---

## Employee Table

Requirements:

✓ pagination

✓ sorting

✓ search

✓ loading state

✓ empty state

✓ error state

Columns:

```txt
Employee ID

Name

Email

Department

Country

Job Title

Salary

Employment Type

Actions
```

Use:

- Tremor Table
- Tremor Card
- Tremor Badge

---

## Employee Search

Requirements:

Search:

```txt
fullName
email
```

Debounce:

```txt
300ms
```

Controller owns:

```ts
search
setSearch
```

---

## Filters

Support:

```txt
country

department

jobTitle
```

Controller owns filter state.

---

## Employee Form

Support:

✓ Create

✓ Update

Use:

- react-hook-form
- zod validation

Fields:

```txt
Full Name

Email

Department

Country

Job Title

Salary

Employment Type

Joining Date
```

---

## Delete Flow

Requirements:

- confirmation dialog
- mutation loading state

---

## React Query

Requirements:

Mutations invalidate:

```txt
employees
```

---

## Validation

Verify:

✓ employee list renders

✓ search works

✓ filters work

✓ create works

✓ update works

✓ delete works

✓ loading states work

✓ error states work
```

---

## Commit

```bash
git add .

git commit -m "feat(web): implement employee management UI"
```
