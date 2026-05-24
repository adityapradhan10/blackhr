import type { AxiosAdapter } from 'axios';
import { act, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useEmployeesPageController } from '../../../../../src/modules/employees/controllers/useEmployeesPageController';
import { api } from '../../../../../src/shared/services/api';
import { renderHookWithQueryClient } from '../../../../render-hook-with-query-client';
import { createListResponse, mockEmployeeApi, sampleEmployee } from '../mocks';

const originalAdapter = api.defaults.adapter;

afterEach(() => {
  api.defaults.adapter = originalAdapter;
  vi.useRealTimers();
});

describe('useEmployeesPageController', () => {
  it('returns display-ready state when employees are loaded', async () => {
    mockEmployeeApi({});

    const { result } = renderHookWithQueryClient(() => useEmployeesPageController());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.employees).toEqual([sampleEmployee]);
    expect(result.current.isError).toBe(false);
    expect(result.current.totalPages).toBe(1);
  });

  it('triggers form and delete dialog actions from controller mutations', async () => {
    mockEmployeeApi({});

    const { result } = renderHookWithQueryClient(() => useEmployeesPageController());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.openCreateForm();
    });

    expect(result.current.isFormOpen).toBe(true);
    expect(result.current.editingEmployee).toBeNull();

    act(() => {
      result.current.openEditForm(sampleEmployee);
    });

    expect(result.current.isFormOpen).toBe(true);
    expect(result.current.editingEmployee).toEqual(sampleEmployee);

    act(() => {
      result.current.closeForm();
      result.current.openDeleteDialog(sampleEmployee);
    });

    expect(result.current.isFormOpen).toBe(false);
    expect(result.current.deletingEmployee).toEqual(sampleEmployee);

    act(() => {
      result.current.closeDeleteDialog();
    });

    expect(result.current.deletingEmployee).toBeNull();
  });

  it('computes query filters, debounced search, and sort state', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const adapter = mockEmployeeApi({
      list: (config) => {
        const params = config.params ?? {};

        if (
          params.search === 'priya' &&
          params.country === 'India' &&
          params.department === 'Engineering' &&
          params.sortBy === 'fullName' &&
          params.sortOrder === 'desc'
        ) {
          return createListResponse([
            {
              ...sampleEmployee,
              fullName: 'Priya Verma',
              id: 'employee-2',
            },
          ]);
        }

        return createListResponse();
      },
    });

    const { result } = renderHookWithQueryClient(() => useEmployeesPageController());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setSearch('priya');
      result.current.updateFilter('country', 'India');
      result.current.updateFilter('department', 'Engineering');
    });

    act(() => {
      result.current.handleSort('fullName');
    });

    act(() => {
      result.current.handleSort('fullName');
    });

    expect(result.current.sortBy).toBe('fullName');
    expect(result.current.sortOrder).toBe('desc');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    await waitFor(() => {
      const lastCall = adapter.mock.calls.at(-1)?.[0];

      expect(lastCall?.params).toMatchObject({
        country: 'India',
        department: 'Engineering',
        search: 'priya',
        sortBy: 'fullName',
        sortOrder: 'desc',
      });
    });
  });

  it('resets page when filters change and confirms delete successfully', async () => {
    const adapter = mockEmployeeApi({
      list: (config) =>
        createListResponse([sampleEmployee], {
          page: config.params?.page as number,
          totalPages: 3,
        }),
    });

    const { result } = renderHookWithQueryClient(() => useEmployeesPageController());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setPage(2);
    });

    await waitFor(() => {
      expect(result.current.page).toBe(2);
    });

    act(() => {
      result.current.updateFilter('country', 'India');
    });

    expect(result.current.page).toBe(1);

    act(() => {
      result.current.openDeleteDialog(sampleEmployee);
    });

    await act(async () => {
      await result.current.confirmDelete();
    });

    await waitFor(() => {
      expect(result.current.deletingEmployee).toBeNull();
    });

    expect(result.current.feedbackMessage).toBe('Employee deleted successfully.');
    expect(adapter).toHaveBeenCalled();
  });

  it('surfaces query errors in controller state', async () => {
    api.defaults.adapter = vi.fn<AxiosAdapter>(async (config) => Promise.reject(new Error('Network error')));

    const { result } = renderHookWithQueryClient(() => useEmployeesPageController());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.employees).toEqual([]);
  });
});
