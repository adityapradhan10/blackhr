import { Navigate, Route, Routes } from 'react-router-dom';
import { EmployeesPage } from '../modules/employees/views/employees-page';
import { AppLayout } from '../shared/layouts/AppLayout';

function DashboardPlaceholderPage() {
  return (
    <section>
      <h1>Dashboard</h1>
      <p>Salary analytics will appear here.</p>
    </section>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route element={<Navigate replace to="/dashboard" />} index />
        <Route element={<DashboardPlaceholderPage />} path="dashboard" />
        <Route element={<EmployeesPage />} path="employees" />
      </Route>
    </Routes>
  );
}
