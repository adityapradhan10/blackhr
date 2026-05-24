import { Select, SelectItem } from '@tremor/react';
import type { CountrySalaryInsight } from '@blackhr/shared-types';
import { PanelCard } from '../../../shared/ui/panel-card';
import { StatBlock } from '../../../shared/ui/stat-block';
import { formatCurrency } from '../types';

type CountryInsightCardProps = {
  countryOptions: readonly string[];
  insight?: CountrySalaryInsight;
  isError: boolean;
  isLoading: boolean;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
};

export function CountryInsightCard({
  countryOptions,
  insight,
  isError,
  isLoading,
  onCountryChange,
  selectedCountry,
}: CountryInsightCardProps) {
  return (
    <PanelCard>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="panel-card-title">Country Salary Insights</h2>
          <p className="panel-card-subtitle mt-1">Compare salary ranges for a selected country</p>
        </div>

        <div className="w-full md:max-w-xs" data-testid="dashboard-country-select">
          <Select
            aria-label="Country"
            className="max-w-full"
            onValueChange={onCountryChange}
            value={selectedCountry}
          >
            {countryOptions.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500" role="status">
          Loading country insights...
        </p>
      ) : null}

      {isError ? (
        <p aria-label="Country insight error" className="text-sm text-red-600" role="alert">
          Unable to load country salary insights.
        </p>
      ) : null}

      {!isLoading && !isError && insight ? (
        <div className="grid gap-4 md:grid-cols-3">
          <StatBlock label="Minimum salary" value={formatCurrency(insight.minSalary)} />
          <StatBlock label="Maximum salary" value={formatCurrency(insight.maxSalary)} />
          <StatBlock label="Average salary" value={formatCurrency(insight.averageSalary)} />
        </div>
      ) : null}

      {!isLoading && !isError && !insight ? (
        <p className="text-sm text-slate-500">No country insight data available.</p>
      ) : null}
    </PanelCard>
  );
}
