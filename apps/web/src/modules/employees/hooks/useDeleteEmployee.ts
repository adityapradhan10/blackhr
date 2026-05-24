import { useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeApi } from '../models/employee.api';
import { EMPLOYEES_QUERY_KEY } from './query-keys';

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => employeeApi.deleteEmployee(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [EMPLOYEES_QUERY_KEY] });
    },
  });
}
