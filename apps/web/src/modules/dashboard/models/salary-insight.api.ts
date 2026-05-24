import type { CountrySalaryInsight, DashboardMetrics, JobTitleSalaryInsight } from '@blackhr/shared-types';
import { api } from '../../../shared/services/api';

export const salaryInsightApi = {
  async getCountrySalaryInsights(country: string): Promise<CountrySalaryInsight> {
    const response = await api.get<CountrySalaryInsight>(`/salary-insights/country/${encodeURIComponent(country)}`);

    return response.data;
  },

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const response = await api.get<DashboardMetrics>('/salary-insights/dashboard');

    return response.data;
  },

  async getJobTitleSalaryInsights(country: string, jobTitle: string): Promise<JobTitleSalaryInsight> {
    const response = await api.get<JobTitleSalaryInsight>('/salary-insights/job-title', {
      params: { country, jobTitle },
    });

    return response.data;
  },
};
