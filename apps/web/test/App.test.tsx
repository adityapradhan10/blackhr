import { cleanup, render, screen } from '@testing-library/react';
import type { AxiosAdapter, AxiosResponse } from 'axios';
import type { DashboardMetrics } from '@blackhr/shared-types';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from '../src/App';
import { api } from '../src/shared/services/api';

const originalAdapter = api.defaults.adapter;

const sampleDashboardMetrics: DashboardMetrics = {
  departmentDistribution: [],
  highestPayingCountry: 'United States',
  highestPayingRole: 'Senior Software Engineer',
  medianSalary: 85000,
  salaryDistribution: [],
  totalEmployees: 10000,
};

afterEach(() => {
  cleanup();
  api.defaults.adapter = originalAdapter;
});

describe(App.name, () => {
  it('redirects the root route to the dashboard page', async () => {
    mockSalaryInsightApi();

    window.history.pushState({}, '', '/');

    render(<App />);

    expect(await screen.findByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /employees/i })).toBeInTheDocument();
  });

  it('loads dashboard metrics on the dashboard page', async () => {
    const adapter = mockSalaryInsightApi();

    window.history.pushState({}, '', '/dashboard');
    render(<App />);

    expect(await screen.findByText('Total Employees')).toBeInTheDocument();
    expect(await screen.findByText('$85,000')).toBeInTheDocument();
    expect(adapter).toHaveBeenCalled();
  });
});

function mockSalaryInsightApi() {
  const adapter = vi.fn<AxiosAdapter>(async (config): Promise<AxiosResponse> => {
    const url = config.url ?? '';

    if (url === '/salary-insights/dashboard') {
      return {
        config,
        data: sampleDashboardMetrics,
        headers: {},
        status: 200,
        statusText: 'OK',
      };
    }

    if (url.startsWith('/salary-insights/country/')) {
      const country = decodeURIComponent(url.replace('/salary-insights/country/', ''));

      return {
        config,
        data: {
          averageSalary: country === 'United States' ? 140000 : 95000,
          country,
          maxSalary: country === 'United States' ? 250000 : 200000,
          minSalary: country === 'United States' ? 80000 : 50000,
        },
        headers: {},
        status: 200,
        statusText: 'OK',
      };
    }

    if (url === '/salary-insights/job-title') {
      return {
        config,
        data: {
          averageSalary: 120000,
          country: 'India',
          jobTitle: 'Software Engineer',
        },
        headers: {},
        status: 200,
        statusText: 'OK',
      };
    }

    return {
      config,
      data: {},
      headers: {},
      status: 200,
      statusText: 'OK',
    };
  });

  api.defaults.adapter = adapter;

  return adapter;
}
