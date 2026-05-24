import { useMemo, useState } from 'react';
import { COUNTRY_OPTIONS, JOB_TITLE_OPTIONS } from '../../../shared/constants/workforce-options';
import { useCountryComparisonInsights } from '../hooks/useCountryComparisonInsights';
import { useCountryInsights } from '../hooks/useCountryInsights';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { useJobTitleInsights } from '../hooks/useJobTitleInsights';
import { formatCount, formatCurrency, formatLabel } from '../../../shared/utils/formatters';

export function useDashboardPageController() {
  const [selectedCountry, setSelectedCountry] = useState<string>(COUNTRY_OPTIONS[0]);
  const [selectedJobTitleCountry, setSelectedJobTitleCountry] = useState<string>(COUNTRY_OPTIONS[0]);
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>(JOB_TITLE_OPTIONS[0]);

  const dashboardQuery = useDashboardMetrics();
  const countryInsightQuery = useCountryInsights(selectedCountry);
  const jobTitleInsightQuery = useJobTitleInsights(selectedJobTitleCountry, selectedJobTitle);
  const countryComparisonQueries = useCountryComparisonInsights(COUNTRY_OPTIONS);

  const countryChartData = useMemo(
    () =>
      countryComparisonQueries.flatMap((query, index) => {
        if (!query.data) {
          return [];
        }

        return [
          {
            averageSalary: query.data.averageSalary,
            country: COUNTRY_OPTIONS[index],
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
    countryOptions: COUNTRY_OPTIONS,
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
    jobTitleOptions: JOB_TITLE_OPTIONS,
    salaryDistribution: dashboardData?.salaryDistribution ?? [],
    selectedCountry,
    selectedJobTitle,
    selectedJobTitleCountry,
    setSelectedCountry,
    setSelectedJobTitle,
    setSelectedJobTitleCountry,
  };
}

export type DashboardPageController = ReturnType<typeof useDashboardPageController>;
