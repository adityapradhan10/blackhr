import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { CountrySalaryInsight, DashboardMetrics, JobTitleSalaryInsight } from '@blackhr/shared-types';
import { vi } from 'vitest';
import { api } from '../../../../src/shared/services/api';

export const sampleDashboardMetrics: DashboardMetrics = {
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

export const indiaCountryInsight: CountrySalaryInsight = {
  averageSalary: 95000,
  country: 'India',
  maxSalary: 200000,
  minSalary: 50000,
};

export const usCountryInsight: CountrySalaryInsight = {
  averageSalary: 140000,
  country: 'United States',
  maxSalary: 250000,
  minSalary: 80000,
};

export const softwareEngineerInsight: JobTitleSalaryInsight = {
  averageSalary: 120000,
  country: 'India',
  jobTitle: 'Software Engineer',
};

export function mockSalaryInsightApi(handlers: {
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
        return {
          config,
          data: await handlers.country(config),
          headers: {},
          status: 200,
          statusText: 'OK',
        };
      }

      const countryInsight =
        country === 'United States'
          ? usCountryInsight
          : {
              ...indiaCountryInsight,
              country,
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
