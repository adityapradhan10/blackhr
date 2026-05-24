import { useQuery } from '@tanstack/react-query';
import { salaryInsightApi } from '../models/salary-insight.api';
import { JOB_TITLE_INSIGHTS_QUERY_KEY } from './query-keys';

export { JOB_TITLE_INSIGHTS_QUERY_KEY } from './query-keys';

export function useJobTitleInsights(country: string, jobTitle: string) {
  return useQuery({
    enabled: Boolean(country.trim() && jobTitle.trim()),
    queryFn: () => salaryInsightApi.getJobTitleSalaryInsights(country, jobTitle),
    queryKey: [JOB_TITLE_INSIGHTS_QUERY_KEY, country, jobTitle],
  });
}
