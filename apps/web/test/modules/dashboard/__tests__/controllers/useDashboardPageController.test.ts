import type { AxiosAdapter } from 'axios';
import { act, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useDashboardPageController } from '../../../../../src/modules/dashboard/controllers/useDashboardPageController';
import { api } from '../../../../../src/shared/services/api';
import { renderHookWithQueryClient } from '../../../../render-hook-with-query-client';
import {
  indiaCountryInsight,
  mockSalaryInsightApi,
  sampleDashboardMetrics,
  softwareEngineerInsight,
  usCountryInsight,
} from '../mocks';

const originalAdapter = api.defaults.adapter;

afterEach(() => {
  api.defaults.adapter = originalAdapter;
});

describe('useDashboardPageController', () => {
  it('returns display-ready formatted KPI values', async () => {
    mockSalaryInsightApi({});

    const { result } = renderHookWithQueryClient(() => useDashboardPageController());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.display).toEqual({
      highestPayingCountry: 'United States',
      highestPayingRole: 'Senior Software Engineer',
      medianSalary: '$85,000',
      totalEmployees: '10,000',
    });
    expect(result.current.departmentDistribution).toEqual(sampleDashboardMetrics.departmentDistribution);
    expect(result.current.salaryDistribution).toEqual(sampleDashboardMetrics.salaryDistribution);
  });

  it('updates country and job title selections through controller actions', async () => {
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

    const { result } = renderHookWithQueryClient(() => useDashboardPageController());

    await waitFor(() => {
      expect(result.current.countryInsight).toEqual(indiaCountryInsight);
    });

    act(() => {
      result.current.setSelectedCountry('United States');
    });

    await waitFor(() => {
      expect(result.current.countryInsight).toEqual(usCountryInsight);
    });

    act(() => {
      result.current.setSelectedJobTitle('Product Manager');
    });

    await waitFor(() => {
      expect(result.current.jobTitleInsight?.averageSalary).toBe(105000);
    });
  });

  it('computes derived chart and empty-state flags', async () => {
    mockSalaryInsightApi({
      dashboard: () => ({
        ...sampleDashboardMetrics,
        departmentDistribution: [],
        salaryDistribution: [],
      }),
    });

    const { result } = renderHookWithQueryClient(() => useDashboardPageController());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isDepartmentChartEmpty).toBe(true);
    expect(result.current.isSalaryDistributionEmpty).toBe(true);
    expect(result.current.countryChartData.length).toBeGreaterThan(0);
    expect(result.current.isCountryChartLoading).toBe(false);
  });

  it('surfaces dashboard query errors in controller state', async () => {
    api.defaults.adapter = vi.fn<AxiosAdapter>(async (config) => Promise.reject(new Error('Network error')));

    const { result } = renderHookWithQueryClient(() => useDashboardPageController());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.display.totalEmployees).toBe('—');
  });
});
