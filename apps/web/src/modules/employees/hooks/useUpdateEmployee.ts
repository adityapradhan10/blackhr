import type { UpdateEmployeeRequest } from '@blackhr/shared-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeApi } from '../models/employee.api';
import { EMPLOYEES_QUERY_KEY } from './useEmployees';

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateEmployeeRequest }) => employeeApi.updateEmployee(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [EMPLOYEES_QUERY_KEY] });
    },
  });
}
