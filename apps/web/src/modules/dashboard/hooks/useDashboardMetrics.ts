import { useQuery } from '@tanstack/react-query';
import { salaryInsightApi } from '../models/salary-insight.api';

export const DASHBOARD_METRICS_QUERY_KEY = 'dashboardMetrics';

export function useDashboardMetrics() {
  return useQuery({
    queryFn: () => salaryInsightApi.getDashboardMetrics(),
    queryKey: [DASHBOARD_METRICS_QUERY_KEY],
  });
}
