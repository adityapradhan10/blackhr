import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { CountrySalaryInsight, DashboardMetrics, JobTitleSalaryInsight } from '@blackhr/shared-types';
import { cleanup, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from '../../../src/shared/services/api';
import { renderDashboardPage } from './test-utils';

const originalAdapter = api.defaults.adapter;

const sampleDashboardMetrics: DashboardMetrics = {
  departmentDistribution: [
    { count: 4000, label: 'Engineering' },
    { count: 2000, label: 'Sales' },
  ],
  highestPayingCountry: 'United States',
  highestPayingRole: 'Senior Software Engineer',
  medianSalary: 85000,
  salaryDistribution: [
    { count: 2500, label: '50000-99999' },
    { count: 3200, label: '100000-149999' },
  ],
  totalEmployees: 10000,
};

const indiaCountryInsight: CountrySalaryInsight = {
  averageSalary: 95000,
  country: 'India',
  maxSalary: 200000,
  minSalary: 50000,
};

const usCountryInsight: CountrySalaryInsight = {
  averageSalary: 140000,
  country: 'United States',
  maxSalary: 250000,
  minSalary: 80000,
};

const softwareEngineerInsight: JobTitleSalaryInsight = {
  averageSalary: 120000,
  country: 'India',
  jobTitle: 'Software Engineer',
};

function mockSalaryInsightApi(handlers: {
  country?: (config: InternalAxiosRequestConfig) => CountrySalaryInsight | Promise<CountrySalaryInsight>;
  dashboard?: () => DashboardMetrics | Promise<DashboardMetrics>;
  jobTitle?: (config: InternalAxiosRequestConfig) => JobTitleSalaryInsight | Promise<JobTitleSalaryInsight>;
}) {
  const adapter = vi.fn<AxiosAdapter>(async (config): Promise<AxiosResponse> => {
    const method = config.method?.toUpperCase();
    const url = config.url ?? '';

    if (method === 'GET' && url === '/salary-insights/dashboard') {
      const data = handlers.dashboard ? await handlers.dashboard() : sampleDashboardMetrics;

      return {
        config,
        data,
        headers: {},
        status: 200,
        statusText: 'OK',
      };
    }

    if (method === 'GET' && url.startsWith('/salary-insights/country/')) {
      const country = decodeURIComponent(url.replace('/salary-insights/country/', ''));

      if (handlers.country) {
        try {
          return {
            config,
            data: await handlers.country(config),
            headers: {},
            status: 200,
            statusText: 'OK',
          };
        } catch (error) {
          return Promise.reject(error);
        }
      }

      const countryInsight =
        country === 'United States'
          ? usCountryInsight
          : {
              ...indiaCountryInsight,
              averageSalary: country === 'India' ? 95000 : 90000,
              country,
              maxSalary: 180000,
              minSalary: 45000,
            };

      return {
        config,
        data: countryInsight,
        headers: {},
        status: 200,
        statusText: 'OK',
      };
    }

    if (method === 'GET' && url === '/salary-insights/job-title') {
      const data = handlers.jobTitle ? await handlers.jobTitle(config) : softwareEngineerInsight;

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
});

async function selectFilterOption(user: ReturnType<typeof userEvent.setup>, fieldTestId: string, option: string) {
  const filterField = screen.getByTestId(fieldTestId);

  await user.click(within(filterField).getByRole('button'));
  await user.click(await screen.findByRole('option', { name: option }));
}

describe('DashboardPage', () => {
  it('renders dashboard KPI cards when metrics are loaded', async () => {
    mockSalaryInsightApi({});

    renderDashboardPage();

    expect(await screen.findByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
    expect(await screen.findByText('Total Employees')).toBeInTheDocument();
    expect(await screen.findByText('10,000')).toBeInTheDocument();
    expect(await screen.findByText('Highest Paying Country')).toBeInTheDocument();
    expect(
      within(screen.getByText('Highest Paying Country').closest('div')!.parentElement!).getByText('United States'),
    ).toBeInTheDocument();
    expect(await screen.findByText('Highest Paying Role')).toBeInTheDocument();
    expect(await screen.findByText('Senior Software Engineer')).toBeInTheDocument();
    expect(await screen.findByText('Median Salary')).toBeInTheDocument();
    expect(await screen.findByText('$85,000')).toBeInTheDocument();
  });

  it('shows a loading state while dashboard metrics are being fetched', () => {
    mockSalaryInsightApi({
      dashboard: () => new Promise(() => undefined),
    });

    renderDashboardPage();

    expect(screen.getByRole('status', { name: /loading dashboard/i })).toBeInTheDocument();
  });

  it('shows an error state when dashboard metrics fail to load', async () => {
    api.defaults.adapter = vi.fn<AxiosAdapter>(async (config) => Promise.reject(new Error('Network error')));

    renderDashboardPage();

    expect(await screen.findByRole('alert')).toHaveTextContent(/unable to load dashboard/i);
  });

  it('updates country salary metrics when a different country is selected', async () => {
    const user = userEvent.setup();

    mockSalaryInsightApi({});

    renderDashboardPage();

    await screen.findByText('$95,000');

    await selectFilterOption(user, 'dashboard-country-select', 'United States');

    expect(await screen.findByText('$140,000')).toBeInTheDocument();
    expect(await screen.findByText('$250,000')).toBeInTheDocument();
    expect(await screen.findByText('$80,000')).toBeInTheDocument();
  });

  it('updates job title salary metrics when role selection changes', async () => {
    const user = userEvent.setup();

    mockSalaryInsightApi({
      jobTitle: (config) => {
        const jobTitle = config.params?.jobTitle as string;

        if (jobTitle === 'Product Manager') {
          return {
            averageSalary: 105000,
            country: 'India',
            jobTitle: 'Product Manager',
          };
        }

        return softwareEngineerInsight;
      },
    });

    renderDashboardPage();

    await screen.findByText('$120,000');

    await selectFilterOption(user, 'dashboard-job-title-select', 'Product Manager');

    expect(await screen.findByText('$105,000')).toBeInTheDocument();
  });

  it('renders salary distribution and department charts', async () => {
    mockSalaryInsightApi({});

    renderDashboardPage();

    expect(await screen.findByText(/salary distribution by country/i)).toBeInTheDocument();
    expect(await screen.findByText(/employees by department/i)).toBeInTheDocument();
    expect(await screen.findByTestId('salary-country-chart')).toBeInTheDocument();
    expect(await screen.findByTestId('department-distribution-chart')).toBeInTheDocument();
  });

  it('shows widget empty states when chart data is unavailable', async () => {
    mockSalaryInsightApi({
      country: () => Promise.reject(new Error('No country data')),
      dashboard: () => ({
        ...sampleDashboardMetrics,
        departmentDistribution: [],
        salaryDistribution: [],
      }),
    });

    renderDashboardPage();

    expect(await screen.findByText(/no department data/i)).toBeInTheDocument();
    expect(await screen.findByText(/unable to load country salary chart/i)).toBeInTheDocument();
  });

  it('shows country insight error state when country metrics fail', async () => {
    mockSalaryInsightApi({
      country: () => Promise.reject(new Error('Country unavailable')),
    });

    renderDashboardPage();

    expect(await screen.findByRole('alert', { name: /country insight error/i })).toBeInTheDocument();
  });
});
