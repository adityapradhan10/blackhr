import { act, waitFor } from '@testing-library/react';
import { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useEmployeeFormController } from '../../../../../src/modules/employees/controllers/useEmployeeFormController';
import { api } from '../../../../../src/shared/services/api';
import { renderHookWithQueryClient } from '../../../../render-hook-with-query-client';
import { mockCreateEmployeeInput, mockEmployeeApi, sampleEmployee } from '../mocks';

const originalAdapter = api.defaults.adapter;

afterEach(() => {
  api.defaults.adapter = originalAdapter;
});

describe('useEmployeeFormController', () => {
  it('returns create-mode defaults and submits a new employee', async () => {
    const onClose = vi.fn();
    const onError = vi.fn();
    const onSuccess = vi.fn();

    mockEmployeeApi({
      create: () => ({
        ...sampleEmployee,
        ...mockCreateEmployeeInput(),
        employeeId: 'BHR-00099',
        id: 'employee-new',
      }),
    });

    const { result } = renderHookWithQueryClient(() =>
      useEmployeeFormController({
        employee: null,
        onClose,
        onError,
        onSuccess,
      }),
    );

    expect(result.current.isEditing).toBe(false);

    act(() => {
      result.current.form.setValue('fullName', 'New Hire');
      result.current.form.setValue('email', 'new.hire@blackhr.example');
      result.current.form.setValue('department', 'Engineering');
      result.current.form.setValue('country', 'India');
      result.current.form.setValue('jobTitle', 'Software Engineer');
      result.current.form.setValue('salary', 95000);
      result.current.form.setValue('employmentType', 'FULL_TIME');
      result.current.form.setValue('joiningDate', '2024-02-01');
    });

    await act(async () => {
      await result.current.submit();
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith('Employee created successfully.');
    });

    expect(onClose).toHaveBeenCalled();
  });

  it('prefills edit values and submits updates for an existing employee', async () => {
    const onClose = vi.fn();
    const onError = vi.fn();
    const onSuccess = vi.fn();

    mockEmployeeApi({
      update: () => ({
        ...sampleEmployee,
        fullName: 'Aarav Sharma Updated',
        salary: 130000,
      }),
    });

    const { result } = renderHookWithQueryClient(() =>
      useEmployeeFormController({
        employee: sampleEmployee,
        onClose,
        onError,
        onSuccess,
      }),
    );

    expect(result.current.isEditing).toBe(true);
    expect(result.current.form.getValues('fullName')).toBe('Aarav Sharma');

    act(() => {
      result.current.form.setValue('fullName', 'Aarav Sharma Updated');
      result.current.form.setValue('salary', 130000);
    });

    await act(async () => {
      await result.current.submit();
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith('Employee updated successfully.');
    });

    expect(onClose).toHaveBeenCalled();
  });

  it('reports API errors without closing the form', async () => {
    const onClose = vi.fn();
    const onError = vi.fn();
    const onSuccess = vi.fn();

    api.defaults.adapter = vi.fn(async () =>
      Promise.reject(
        new AxiosError('Conflict', '409', undefined, undefined, {
          data: { message: 'Employee email already exists' },
          status: 409,
          statusText: 'Conflict',
          headers: {},
          config: {} as InternalAxiosRequestConfig,
        }),
      ),
    );

    const { result } = renderHookWithQueryClient(() =>
      useEmployeeFormController({
        employee: null,
        onClose,
        onError,
        onSuccess,
      }),
    );

    act(() => {
      result.current.form.setValue('fullName', 'Duplicate Hire');
      result.current.form.setValue('email', 'qa.contract@blackhr.example');
      result.current.form.setValue('department', 'Engineering');
      result.current.form.setValue('country', 'India');
      result.current.form.setValue('jobTitle', 'Software Engineer');
      result.current.form.setValue('salary', 95000);
      result.current.form.setValue('employmentType', 'CONTRACT');
      result.current.form.setValue('joiningDate', '2024-02-01');
    });

    await act(async () => {
      await result.current.submit();
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Employee email already exists');
    });

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});
