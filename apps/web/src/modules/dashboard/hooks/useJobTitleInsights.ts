import { useQuery } from '@tanstack/react-query';
import { salaryInsightApi } from '../models/salary-insight.api';

export const JOB_TITLE_INSIGHTS_QUERY_KEY = 'jobTitleInsights';

export function useJobTitleInsights(country: string, jobTitle: string) {
  return useQuery({
    enabled: Boolean(country.trim() && jobTitle.trim()),
    queryFn: () => salaryInsightApi.getJobTitleSalaryInsights(country, jobTitle),
    queryKey: [JOB_TITLE_INSIGHTS_QUERY_KEY, country, jobTitle],
  });
}
