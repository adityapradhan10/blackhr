import { Select, SelectItem, TextInput } from '@tremor/react';
import { PanelCard } from '../../../shared/ui/panel-card';
import type { EmployeeFilters } from '../controllers/useEmployeesPageController';
import { FILTER_COUNTRY_OPTIONS, FILTER_DEPARTMENT_OPTIONS, FILTER_JOB_TITLE_OPTIONS } from '../types';

type EmployeeFiltersProps = {
  filters: EmployeeFilters;
  onFilterChange: (key: keyof EmployeeFilters, value: string) => void;
  onSearchChange: (value: string) => void;
  search: string;
};

export function EmployeeFiltersPanel({ filters, onFilterChange, onSearchChange, search }: EmployeeFiltersProps) {
  return (
    <PanelCard className="mb-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-700">Search employees</span>
          <TextInput
            aria-label="Search employees"
            onValueChange={onSearchChange}
            placeholder="Search by name or email"
            role="searchbox"
            value={search}
          />
        </div>

        <div className="flex flex-col gap-1.5" data-testid="filter-country">
          <span className="text-sm font-medium text-slate-700">Country</span>
          <Select aria-label="Country" onValueChange={(value: string) => onFilterChange('country', value)} value={filters.country}>
            {FILTER_COUNTRY_OPTIONS.map((option) => (
              <SelectItem key={option || 'all-countries'} value={option}>
                {option || 'All countries'}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1.5" data-testid="filter-department">
          <span className="text-sm font-medium text-slate-700">Department</span>
          <Select
            aria-label="Department"
            onValueChange={(value: string) => onFilterChange('department', value)}
            value={filters.department}
          >
            {FILTER_DEPARTMENT_OPTIONS.map((option) => (
              <SelectItem key={option || 'all-departments'} value={option}>
                {option || 'All departments'}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1.5" data-testid="filter-job-title">
          <span className="text-sm font-medium text-slate-700">Job Title</span>
          <Select
            aria-label="Job Title"
            onValueChange={(value: string) => onFilterChange('jobTitle', value)}
            value={filters.jobTitle}
          >
            {FILTER_JOB_TITLE_OPTIONS.map((option) => (
              <SelectItem key={option || 'all-job-titles'} value={option}>
                {option || 'All job titles'}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
    </PanelCard>
  );
}
