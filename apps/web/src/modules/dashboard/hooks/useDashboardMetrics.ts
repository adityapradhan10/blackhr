import { useQuery } from '@tanstack/react-query';
import { salaryInsightApi } from '../models/salary-insight.api';
import { DASHBOARD_METRICS_QUERY_KEY } from './query-keys';

export { DASHBOARD_METRICS_QUERY_KEY } from './query-keys';

export function useDashboardMetrics() {
  return useQuery({
    queryFn: () => salaryInsightApi.getDashboardMetrics(),
    queryKey: [DASHBOARD_METRICS_QUERY_KEY],
  });
}
