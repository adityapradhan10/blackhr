import { Select, SelectItem } from '@tremor/react';
import type { JobTitleSalaryInsight } from '@blackhr/shared-types';
import { PanelCard } from '../../../shared/ui/panel-card';
import { StatBlock } from '../../../shared/ui/stat-block';
import { formatCurrency } from '../types';

type JobTitleInsightProps = {
  countryOptions: readonly string[];
  insight?: JobTitleSalaryInsight;
  isError: boolean;
  isLoading: boolean;
  jobTitleOptions: readonly string[];
  selectedCountry: string;
  selectedJobTitle: string;
  onCountryChange: (country: string) => void;
  onJobTitleChange: (jobTitle: string) => void;
};

export function JobTitleInsight({
  countryOptions,
  insight,
  isError,
  isLoading,
  jobTitleOptions,
  onCountryChange,
  onJobTitleChange,
  selectedCountry,
  selectedJobTitle,
}: JobTitleInsightProps) {
  return (
    <PanelCard>
      <div className="mb-6">
        <h2 className="panel-card-title">Job Title Salary Insights</h2>
        <p className="panel-card-subtitle mt-1">Average compensation by role and country</p>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-2">
        <div data-testid="dashboard-job-title-country-select">
          <Select aria-label="Country" onValueChange={onCountryChange} value={selectedCountry}>
            {countryOptions.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div data-testid="dashboard-job-title-select">
          <Select aria-label="Job Title" onValueChange={onJobTitleChange} value={selectedJobTitle}>
            {jobTitleOptions.map((jobTitle) => (
              <SelectItem key={jobTitle} value={jobTitle}>
                {jobTitle}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500" role="status">
          Loading job title insights...
        </p>
      ) : null}

      {isError ? (
        <p className="text-sm text-red-600" role="alert">
          Unable to load job title salary insights.
        </p>
      ) : null}

      {!isLoading && !isError && insight ? (
        <StatBlock label="Average salary for selected role" value={formatCurrency(insight.averageSalary)} />
      ) : null}

      {!isLoading && !isError && !insight ? (
        <p className="text-sm text-slate-500">No job title insight data available.</p>
      ) : null}
    </PanelCard>
  );
}
