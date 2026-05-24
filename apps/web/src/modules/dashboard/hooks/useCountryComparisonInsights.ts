import { useQueries } from '@tanstack/react-query';
import { salaryInsightApi } from '../models/salary-insight.api';
import { COUNTRY_INSIGHTS_QUERY_KEY } from './query-keys';

export function useCountryComparisonInsights(countries: readonly string[]) {
  return useQueries({
    queries: countries.map((country) => ({
      enabled: Boolean(country.trim()),
      queryFn: () => salaryInsightApi.getCountrySalaryInsights(country),
      queryKey: [COUNTRY_INSIGHTS_QUERY_KEY, country],
    })),
  });
}
