import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardPage } from '../modules/dashboard/views/dashboard-page';
import { EmployeesPage } from '../modules/employees/views/employees-page';
import { AppLayout } from '../shared/layouts/AppLayout';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route element={<Navigate replace to="/dashboard" />} index />
        <Route element={<DashboardPage />} path="dashboard" />
        <Route element={<EmployeesPage />} path="employees" />
      </Route>
    </Routes>
  );
}
