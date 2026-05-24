import { useQuery } from '@tanstack/react-query';
import { salaryInsightApi } from '../models/salary-insight.api';

export const COUNTRY_INSIGHTS_QUERY_KEY = 'countryInsights';

export function useCountryInsights(country: string) {
  return useQuery({
    enabled: Boolean(country.trim()),
    queryFn: () => salaryInsightApi.getCountrySalaryInsights(country),
    queryKey: [COUNTRY_INSIGHTS_QUERY_KEY, country],
  });
}
