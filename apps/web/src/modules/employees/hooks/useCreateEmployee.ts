import type { CreateEmployeeRequest } from '@blackhr/shared-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeApi } from '../models/employee.api';
import { EMPLOYEES_QUERY_KEY } from './query-keys';

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEmployeeRequest) => employeeApi.createEmployee(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [EMPLOYEES_QUERY_KEY] });
    },
  });
}
