import type { EmployeeQuery } from '@blackhr/shared-types';
import { useQuery } from '@tanstack/react-query';
import { employeeApi } from '../models/employee.api';

export const EMPLOYEES_QUERY_KEY = 'employees';

export function useEmployees(query: EmployeeQuery) {
  return useQuery({
    queryFn: () => employeeApi.listEmployees(query),
    queryKey: [EMPLOYEES_QUERY_KEY, query],
  });
}
