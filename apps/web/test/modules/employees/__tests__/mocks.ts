import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { CreateEmployeeRequest, EmployeeListResponse, EmployeeResponse } from '@blackhr/shared-types';
import { vi } from 'vitest';
import { api } from '../../../../src/shared/services/api';

export const sampleEmployee: EmployeeResponse = {
  id: 'employee-1',
  employeeId: 'BHR-00001',
  fullName: 'Aarav Sharma',
  email: 'aarav.sharma@blackhr.example',
  jobTitle: 'Software Engineer',
  department: 'Engineering',
  country: 'India',
  salary: 120000,
  currency: 'USD',
  employmentType: 'FULL_TIME',
  joiningDate: '2024-01-15T00:00:00.000Z',
  createdAt: '2024-01-16T00:00:00.000Z',
  updatedAt: '2024-01-16T00:00:00.000Z',
};

export function createListResponse(
  data: EmployeeResponse[] = [sampleEmployee],
  meta?: Partial<EmployeeListResponse['meta']>,
): EmployeeListResponse {
  return {
    data,
    meta: {
      limit: 20,
      page: meta?.page ?? 1,
      total: data.length,
      totalPages: Math.max(1, meta?.totalPages ?? 1),
      ...meta,
    },
  };
}

export function mockEmployeeApi(handlers: {
  list?: (config: InternalAxiosRequestConfig) => EmployeeListResponse | Promise<EmployeeListResponse>;
  create?: (config: InternalAxiosRequestConfig) => EmployeeResponse | Promise<EmployeeResponse>;
  update?: (config: InternalAxiosRequestConfig) => EmployeeResponse | Promise<EmployeeResponse>;
  delete?: (config: InternalAxiosRequestConfig) => EmployeeResponse | Promise<EmployeeResponse>;
}) {
  const adapter = vi.fn<AxiosAdapter>(async (config): Promise<AxiosResponse> => {
    const method = config.method?.toUpperCase();
    const url = config.url ?? '';

    if (method === 'GET' && url === '/employees') {
      const data = handlers.list ? await handlers.list(config) : createListResponse();

      return {
        config,
        data,
        headers: {},
        status: 200,
        statusText: 'OK',
      };
    }

    if (method === 'POST' && url === '/employees') {
      const data = handlers.create
        ? await handlers.create(config)
        : {
            ...sampleEmployee,
            ...(config.data ? JSON.parse(config.data as string) : {}),
            id: 'employee-new',
            employeeId: 'BHR-00002',
          };

      return {
        config,
        data,
        headers: {},
        status: 201,
        statusText: 'Created',
      };
    }

    if (method === 'PATCH' && url.startsWith('/employees/')) {
      const data = handlers.update
        ? await handlers.update(config)
        : {
            ...sampleEmployee,
            ...(config.data ? JSON.parse(config.data as string) : {}),
          };

      return {
        config,
        data,
        headers: {},
        status: 200,
        statusText: 'OK',
      };
    }

    if (method === 'DELETE' && url.startsWith('/employees/')) {
      const data = handlers.delete ? await handlers.delete(config) : sampleEmployee;

      return {
        config,
        data,
        headers: {},
        status: 200,
        statusText: 'OK',
      };
    }

    throw new Error(`Unhandled request: ${method} ${url}`);
  });

  api.defaults.adapter = adapter;

  return adapter;
}

export function mockCreateEmployeeInput(): CreateEmployeeRequest {
  return {
    country: 'India',
    department: 'Engineering',
    email: 'new.hire@blackhr.example',
    employmentType: 'FULL_TIME',
    fullName: 'New Hire',
    jobTitle: 'Software Engineer',
    joiningDate: '2024-02-01',
    salary: 95000,
  };
}
