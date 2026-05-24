import type { AxiosAdapter, AxiosResponse } from 'axios';
import type { CreateEmployeeRequest, UpdateEmployeeRequest } from '@blackhr/shared-types';
import { afterEach, describe, expect, it } from 'vitest';
import { salaryInsightApi } from '../src/modules/dashboard/models/salary-insight.api';
import { employeeApi } from '../src/modules/employees/models/employee.api';
import { api } from '../src/shared/services/api';

const originalAdapter = api.defaults.adapter;

afterEach(() => {
  api.defaults.adapter = originalAdapter;
});

function useAdapter(adapter: AxiosAdapter) {
  api.defaults.adapter = adapter;
}

describe('api service layer', () => {
  it('sends requests through the configured API client', async () => {
    useAdapter(async (config): Promise<AxiosResponse<{ ok: true }>> => ({
      config,
      data: { ok: true },
      headers: {},
      status: 200,
      statusText: 'OK',
    }));

    const response = await api.get('/health');

    expect(response.config.baseURL).toBe('http://localhost:3001/api/v1');
    expect(response.config.timeout).toBe(10_000);
    expect(response.config.headers.get('X-Requested-With')).toBe('XMLHttpRequest');
  });

  it('uses employee endpoint contracts', async () => {
    const requests: Array<{
      data?: unknown;
      method?: string;
      params?: unknown;
      url?: string;
    }> = [];
    const createInput: CreateEmployeeRequest = {
      country: 'India',
      email: 'aarav.sharma@blackhr.example',
      fullName: 'Aarav Sharma',
      jobTitle: 'Software Engineer',
      joiningDate: '2024-01-15T00:00:00.000Z',
      salary: 120000,
    };
    const updateInput: UpdateEmployeeRequest = {
      salary: 130000,
    };

    useAdapter(async (config): Promise<AxiosResponse> => {
      requests.push({
        ...(config.data ? { data: JSON.parse(config.data as string) } : {}),
        method: config.method?.toUpperCase(),
        params: config.params,
        url: config.url,
      });

      return {
        config,
        data: config.url === '/employees' ? { data: [], meta: { limit: 20, page: 1, total: 0, totalPages: 0 } } : {},
        headers: {},
        status: 200,
        statusText: 'OK',
      };
    });

    await employeeApi.listEmployees({ page: 1, limit: 20 });
    await employeeApi.getEmployee('employee-1');
    await employeeApi.createEmployee(createInput);
    await employeeApi.updateEmployee('employee-1', updateInput);
    await employeeApi.deleteEmployee('employee-1');

    expect(requests).toEqual([
      { method: 'GET', params: { page: 1, limit: 20 }, url: '/employees' },
      { method: 'GET', params: undefined, url: '/employees/employee-1' },
      { data: createInput, method: 'POST', params: undefined, url: '/employees' },
      { data: updateInput, method: 'PATCH', params: undefined, url: '/employees/employee-1' },
      { method: 'DELETE', params: undefined, url: '/employees/employee-1' },
    ]);
  });

  it('uses salary insight endpoint contracts', async () => {
    const requests: Array<{
      method?: string;
      params?: unknown;
      url?: string;
    }> = [];

    useAdapter(async (config): Promise<AxiosResponse> => {
      requests.push({
        method: config.method?.toUpperCase(),
        params: config.params,
        url: config.url,
      });

      return {
        config,
        data: {},
        headers: {},
        status: 200,
        statusText: 'OK',
      };
    });

    await salaryInsightApi.getCountrySalaryInsights('United States');
    await salaryInsightApi.getDashboardMetrics();
    await salaryInsightApi.getJobTitleSalaryInsights('India', 'Software Engineer');

    expect(requests).toEqual([
      { method: 'GET', params: undefined, url: '/salary-insights/country/United%20States' },
      { method: 'GET', params: undefined, url: '/salary-insights/dashboard' },
      {
        method: 'GET',
        params: { country: 'India', jobTitle: 'Software Engineer' },
        url: '/salary-insights/job-title',
      },
    ]);
  });
});
