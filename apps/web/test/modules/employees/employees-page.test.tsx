import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { CreateEmployeeRequest, EmployeeListResponse, EmployeeResponse } from '@blackhr/shared-types';
import { cleanup, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from '../../../src/shared/services/api';
import { renderEmployeesPage } from './test-utils';

const originalAdapter = api.defaults.adapter;

const sampleEmployee: EmployeeResponse = {
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

function createListResponse(data: EmployeeResponse[] = [sampleEmployee], meta?: Partial<EmployeeListResponse['meta']>): EmployeeListResponse {
  return {
    data,
    meta: {
      limit: 20,
      page: 1,
      total: data.length,
      totalPages: Math.max(1, meta?.totalPages ?? 1),
      ...meta,
    },
  };
}

function mockEmployeeListResponse(data: EmployeeResponse[] = [sampleEmployee], meta?: Partial<EmployeeListResponse['meta']>) {
  const listResponse = createListResponse(data, meta);

  const adapter = vi.fn<AxiosAdapter>(async (config): Promise<AxiosResponse> => ({
    config,
    data: listResponse,
    headers: {},
    status: 200,
    statusText: 'OK',
  }));

  api.defaults.adapter = adapter;

  return adapter;
}

function mockEmployeeApi(handlers: {
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

afterEach(() => {
  cleanup();
  api.defaults.adapter = originalAdapter;
  vi.useRealTimers();
});

async function selectFilterOption(user: ReturnType<typeof userEvent.setup>, fieldTestId: string, option: string) {
  const filterField = screen.getByTestId(fieldTestId);

  await user.click(within(filterField).getByRole('button'));
  await user.click(await screen.findByRole('option', { name: option }));
}

describe('EmployeesPage', () => {
  it('renders the employee list when data is loaded', async () => {
    mockEmployeeListResponse();

    renderEmployeesPage();

    expect(await screen.findByRole('heading', { name: /employees/i })).toBeInTheDocument();
    expect(await screen.findByText('BHR-00001')).toBeInTheDocument();
    expect(await screen.findByText('Aarav Sharma')).toBeInTheDocument();
    expect(await screen.findByText('aarav.sharma@blackhr.example')).toBeInTheDocument();
  });

  it('shows a loading state while employees are being fetched', () => {
    mockEmployeeApi({
      list: () => new Promise(() => undefined),
    });

    renderEmployeesPage();

    expect(screen.getByRole('status', { name: /loading employees/i })).toBeInTheDocument();
  });

  it('shows an empty state when no employees match the query', async () => {
    mockEmployeeListResponse([]);

    renderEmployeesPage();

    expect(await screen.findByText(/no employees found/i)).toBeInTheDocument();
  });

  it('shows an error state when loading employees fails', async () => {
    api.defaults.adapter = vi.fn<AxiosAdapter>(async (config) => Promise.reject(new Error('Network error')));

    renderEmployeesPage();

    expect(await screen.findByRole('alert')).toHaveTextContent(/unable to load employees/i);
  });

  it('searches employees by name or email after debouncing input', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const adapter = mockEmployeeApi({
      list: (config) => {
        const search = config.params?.search as string | undefined;

        if (search === 'priya') {
          return createListResponse([
            {
              ...sampleEmployee,
              email: 'priya.verma@blackhr.example',
              employeeId: 'BHR-00003',
              fullName: 'Priya Verma',
              id: 'employee-3',
            },
          ]);
        }

        return createListResponse();
      },
    });

    renderEmployeesPage();

    await screen.findByText('Aarav Sharma');

    await user.type(screen.getByRole('searchbox', { name: /search employees/i }), 'priya');
    await vi.advanceTimersByTimeAsync(300);

    await waitFor(() => {
      expect(adapter).toHaveBeenCalled();
    });

    expect(await screen.findByText('Priya Verma')).toBeInTheDocument();
    expect(screen.queryByText('Aarav Sharma')).not.toBeInTheDocument();
  });

  it('filters employees by country, department, and job title', async () => {
    const user = userEvent.setup();
    const adapter = mockEmployeeApi({
      list: (config) => {
        const { country, department, jobTitle } = config.params ?? {};

        if (country === 'India' && department === 'Engineering' && jobTitle === 'Software Engineer') {
          return createListResponse([sampleEmployee]);
        }

        return createListResponse([]);
      },
    });

    renderEmployeesPage();

    await selectFilterOption(user, 'filter-country', 'India');
    await selectFilterOption(user, 'filter-department', 'Engineering');
    await selectFilterOption(user, 'filter-job-title', 'Software Engineer');

    await waitFor(() => {
      expect(adapter).toHaveBeenCalled();
    });

    expect(await screen.findByText('Aarav Sharma')).toBeInTheDocument();
  });

  it('creates a new employee from the form', async () => {
    const user = userEvent.setup();
    const createInput: CreateEmployeeRequest = {
      country: 'India',
      department: 'Engineering',
      email: 'new.hire@blackhr.example',
      employmentType: 'FULL_TIME',
      fullName: 'New Hire',
      jobTitle: 'Software Engineer',
      joiningDate: '2024-02-01',
      salary: 95000,
    };

    mockEmployeeApi({
      create: () => ({
        ...sampleEmployee,
        ...createInput,
        createdAt: '2024-02-02T00:00:00.000Z',
        currency: 'USD',
        employeeId: 'BHR-00099',
        id: 'employee-new',
        joiningDate: '2024-02-01T00:00:00.000Z',
        updatedAt: '2024-02-02T00:00:00.000Z',
      }),
      list: () => createListResponse([]),
    });

    renderEmployeesPage();

    await user.click(await screen.findByRole('button', { name: /add employee/i }));

    const form = await screen.findByTestId('employee-form');

    await user.type(within(form).getByLabelText(/full name/i), createInput.fullName);
    await user.type(within(form).getByLabelText(/^email$/i), createInput.email);
    await selectFilterOption(user, 'form-department', createInput.department ?? 'Engineering');
    await selectFilterOption(user, 'form-country', createInput.country);
    await selectFilterOption(user, 'form-job-title', createInput.jobTitle);
    await user.clear(within(form).getByLabelText(/salary/i));
    await user.type(within(form).getByLabelText(/salary/i), String(createInput.salary));
    await selectFilterOption(user, 'form-employment-type', 'Full Time');
    await user.type(within(form).getByLabelText(/joining date/i), '2024-02-01');
    await user.click(within(form).getByRole('button', { name: /save employee/i }));

    expect(await screen.findByText(/employee created successfully/i)).toBeInTheDocument();
  });

  it('updates an existing employee from the form', async () => {
    const user = userEvent.setup();

    mockEmployeeApi({
      list: () => createListResponse([sampleEmployee]),
      update: () => ({
        ...sampleEmployee,
        fullName: 'Aarav Sharma Updated',
        salary: 130000,
      }),
    });

    renderEmployeesPage();

    await user.click(await screen.findByRole('button', { name: /edit aarav sharma/i }));

    const form = await screen.findByTestId('employee-form');

    await user.clear(within(form).getByLabelText(/full name/i));
    await user.type(within(form).getByLabelText(/full name/i), 'Aarav Sharma Updated');
    await user.clear(within(form).getByLabelText(/salary/i));
    await user.type(within(form).getByLabelText(/salary/i), '130000');
    await user.click(within(form).getByRole('button', { name: /save changes/i }));

    expect(await screen.findByText(/employee updated successfully/i)).toBeInTheDocument();
  });

  it('deletes an employee after confirmation', async () => {
    const user = userEvent.setup();
    const adapter = mockEmployeeApi({
      list: () => createListResponse([sampleEmployee]),
    });

    renderEmployeesPage();

    await user.click(await screen.findByRole('button', { name: /delete aarav sharma/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /confirm delete/i }));

    await waitFor(() => {
      expect(adapter).toHaveBeenCalled();
    });

    expect(await screen.findByText(/employee deleted successfully/i)).toBeInTheDocument();
  });

  it('shows loading state while delete mutation is in progress', async () => {
    const user = userEvent.setup();

    mockEmployeeApi({
      delete: () => new Promise(() => undefined),
      list: () => createListResponse([sampleEmployee]),
    });

    renderEmployeesPage();

    await user.click(await screen.findByRole('button', { name: /delete aarav sharma/i }));
    await user.click(screen.getByRole('button', { name: /confirm delete/i }));

    expect(await screen.findByRole('button', { name: /deleting/i })).toBeDisabled();
  });

  it('navigates between pages when pagination controls are used', async () => {
    const user = userEvent.setup();
    const adapter = mockEmployeeApi({
      list: (config) => {
        const page = config.params?.page as number;

        if (page === 2) {
          return createListResponse(
            [
              {
                ...sampleEmployee,
                employeeId: 'BHR-00002',
                fullName: 'Priya Verma',
                id: 'employee-2',
              },
            ],
            { page: 2, totalPages: 2 },
          );
        }

        return createListResponse([sampleEmployee], { page: 1, totalPages: 2 });
      },
    });

    renderEmployeesPage();

    await screen.findByText('Aarav Sharma');
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(await screen.findByText('Priya Verma')).toBeInTheDocument();
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    expect(adapter).toHaveBeenCalled();
  });
});
