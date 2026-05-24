import type { AxiosAdapter } from 'axios';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EMPLOYEES_QUERY_KEY } from '../../../../../src/modules/employees/hooks/useEmployees';
import { useCreateEmployee } from '../../../../../src/modules/employees/hooks/useCreateEmployee';
import { useDeleteEmployee } from '../../../../../src/modules/employees/hooks/useDeleteEmployee';
import { useEmployees } from '../../../../../src/modules/employees/hooks/useEmployees';
import { useUpdateEmployee } from '../../../../../src/modules/employees/hooks/useUpdateEmployee';
import { api } from '../../../../../src/shared/services/api';
import { createQueryClientWrapper } from '../../../../render-hook-with-query-client';
import { mockCreateEmployeeInput, mockEmployeeApi, sampleEmployee } from '../mocks';

const originalAdapter = api.defaults.adapter;

afterEach(() => {
  api.defaults.adapter = originalAdapter;
});

describe('employee React Query hooks', () => {
  it('returns employee list data from the API', async () => {
    mockEmployeeApi({});

    const { Wrapper } = createQueryClientWrapper();
    const { result } = renderHook(() => useEmployees({ page: 1, limit: 20 }), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data).toEqual([sampleEmployee]);
    expect(result.current.data?.meta.total).toBe(1);
  });

  it('handles query errors correctly', async () => {
    api.defaults.adapter = vi.fn<AxiosAdapter>(async (config) => Promise.reject(new Error('Network error')));

    const { Wrapper } = createQueryClientWrapper();
    const { result } = renderHook(() => useEmployees({ page: 1, limit: 20 }), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeTruthy();
  });

  it('invalidates the employees cache after create, update, and delete mutations', async () => {
    mockEmployeeApi({});
    const { queryClient, Wrapper } = createQueryClientWrapper();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result: createHook } = renderHook(() => useCreateEmployee(), { wrapper: Wrapper });
    const { result: updateHook } = renderHook(() => useUpdateEmployee(), { wrapper: Wrapper });
    const { result: deleteHook } = renderHook(() => useDeleteEmployee(), { wrapper: Wrapper });

    await act(async () => {
      await createHook.current.mutateAsync(mockCreateEmployeeInput());
    });

    await act(async () => {
      await updateHook.current.mutateAsync({
        id: sampleEmployee.id,
        input: { salary: 130000 },
      });
    });

    await act(async () => {
      await deleteHook.current.mutateAsync(sampleEmployee.id);
    });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: [EMPLOYEES_QUERY_KEY] });
    });

    expect(invalidateSpy.mock.calls.length).toBeGreaterThanOrEqual(3);
    expect(createHook.current.isSuccess).toBe(true);
    expect(updateHook.current.isSuccess).toBe(true);
    expect(deleteHook.current.isSuccess).toBe(true);
  });

  it('returns mutation errors when create fails', async () => {
    mockEmployeeApi({
      create: () => Promise.reject(new Error('Duplicate email')),
    });

    const { Wrapper } = createQueryClientWrapper();
    const { result } = renderHook(() => useCreateEmployee(), { wrapper: Wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync(mockCreateEmployeeInput())).rejects.toThrow('Duplicate email');
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
