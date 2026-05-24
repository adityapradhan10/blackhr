import { useQueries } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { COUNTRY_INSIGHTS_QUERY_KEY, useCountryInsights } from '../hooks/useCountryInsights';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { useJobTitleInsights } from '../hooks/useJobTitleInsights';
import { salaryInsightApi } from '../models/salary-insight.api';
import {
  DASHBOARD_COUNTRY_OPTIONS,
  DASHBOARD_JOB_TITLE_OPTIONS,
  formatCount,
  formatCurrency,
  formatLabel,
} from '../types';

export function useDashboardPageController() {
  const [selectedCountry, setSelectedCountry] = useState<string>(DASHBOARD_COUNTRY_OPTIONS[0]);
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>(DASHBOARD_JOB_TITLE_OPTIONS[0]);

  const dashboardQuery = useDashboardMetrics();
  const countryInsightQuery = useCountryInsights(selectedCountry);
  const jobTitleInsightQuery = useJobTitleInsights(selectedCountry, selectedJobTitle);

  const countryComparisonQueries = useQueries({
    queries: DASHBOARD_COUNTRY_OPTIONS.map((country) => ({
      queryFn: () => salaryInsightApi.getCountrySalaryInsights(country),
      queryKey: [COUNTRY_INSIGHTS_QUERY_KEY, 'comparison', country],
    })),
  });

  const countryChartData = useMemo(
    () =>
      countryComparisonQueries.flatMap((query, index) => {
        if (!query.data) {
          return [];
        }

        return [
          {
            averageSalary: query.data.averageSalary,
            country: DASHBOARD_COUNTRY_OPTIONS[index],
          },
        ];
      }),
    [countryComparisonQueries],
  );

  const isCountryChartLoading = countryComparisonQueries.some((query) => query.isLoading);
  const isCountryChartError = countryComparisonQueries.some((query) => query.isError);

  const dashboardData = dashboardQuery.data;

  return {
    countryChartData,
    countryInsight: countryInsightQuery.data,
    countryOptions: DASHBOARD_COUNTRY_OPTIONS,
    departmentDistribution: dashboardData?.departmentDistribution ?? [],
    display: {
      highestPayingCountry: formatLabel(dashboardData?.highestPayingCountry),
      highestPayingRole: formatLabel(dashboardData?.highestPayingRole),
      medianSalary: formatCurrency(dashboardData?.medianSalary),
      totalEmployees: formatCount(dashboardData?.totalEmployees),
    },
    isCountryChartError,
    isCountryChartLoading,
    isCountryInsightError: countryInsightQuery.isError,
    isCountryInsightLoading: countryInsightQuery.isLoading,
    isDepartmentChartEmpty: (dashboardData?.departmentDistribution.length ?? 0) === 0,
    isError: dashboardQuery.isError,
    isJobTitleInsightError: jobTitleInsightQuery.isError,
    isJobTitleInsightLoading: jobTitleInsightQuery.isLoading,
    isLoading: dashboardQuery.isLoading,
    isSalaryDistributionEmpty: (dashboardData?.salaryDistribution.length ?? 0) === 0,
    jobTitleInsight: jobTitleInsightQuery.data,
    jobTitleOptions: DASHBOARD_JOB_TITLE_OPTIONS,
    salaryDistribution: dashboardData?.salaryDistribution ?? [],
    selectedCountry,
    selectedJobTitle,
    setSelectedCountry,
    setSelectedJobTitle,
  };
}

export type DashboardPageController = ReturnType<typeof useDashboardPageController>;
