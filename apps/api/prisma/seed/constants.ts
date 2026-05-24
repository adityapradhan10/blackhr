import {
  COUNTRY_OPTIONS,
  DEPARTMENT_OPTIONS,
  EMPLOYMENT_TYPES,
  JOB_TITLE_OPTIONS,
  type Country,
  type Department,
  type JobTitle,
} from '@blackhr/shared-types';

export const SEED_EMPLOYEE_COUNT = 10_000;
export const BATCH_SIZE = 1_000;
export const FAKER_SEED = 20260523;

export const COUNTRIES = COUNTRY_OPTIONS;
export const DEPARTMENTS = DEPARTMENT_OPTIONS;
export const JOB_TITLES = JOB_TITLE_OPTIONS;

export { EMPLOYMENT_TYPES };
export type { Department, JobTitle };

export type SalaryRange = {
  min: number;
  max: number;
};

export type SalaryProfile = SalaryRange & {
  mean: number;
  stdDev: number;
};

export type DepartmentSalaryBand = {
  mean: number;
  stdDev: number;
};

export type JobTitleSalaryAdjustment = {
  meanOffset: number;
  stdDevScale: number;
  min: number;
  max: number;
};

export type CountrySalaryFactor = {
  /** Scales department/title pay bands to reflect local market rates (USD-normalized). */
  meanScale: number;
  stdDevScale: number;
};

export const JOB_TITLE_DEPARTMENTS: Record<JobTitle, Department> = {
  'Software Engineer': 'Engineering',
  'Senior Software Engineer': 'Engineering',
  'Product Manager': 'Product',
  'HR Specialist': 'HR',
  'Finance Analyst': 'Finance',
};

/** Department-level pay bands — job titles adjust within these ranges. */
export const DEPARTMENT_SALARY_BANDS: Record<Department, DepartmentSalaryBand> = {
  Engineering: { mean: 105_000, stdDev: 28_000 },
  Product: { mean: 118_000, stdDev: 24_000 },
  HR: { mean: 62_000, stdDev: 14_000 },
  Finance: { mean: 78_000, stdDev: 18_000 },
  Sales: { mean: 72_000, stdDev: 22_000 },
};

/** Title-specific offsets applied on top of the employee's department band. */
export const JOB_TITLE_SALARY_ADJUSTMENTS: Record<JobTitle, JobTitleSalaryAdjustment> = {
  'Software Engineer': { meanOffset: -18_000, stdDevScale: 1.15, min: 50_000, max: 120_000 },
  'Senior Software Engineer': { meanOffset: 38_000, stdDevScale: 0.9, min: 90_000, max: 180_000 },
  'Product Manager': { meanOffset: 0, stdDevScale: 1.0, min: 80_000, max: 160_000 },
  'HR Specialist': { meanOffset: 0, stdDevScale: 1.05, min: 45_000, max: 90_000 },
  'Finance Analyst': { meanOffset: 0, stdDevScale: 1.0, min: 55_000, max: 110_000 },
};

/** Local market multipliers applied on top of department/title bands (United States = baseline). */
export const COUNTRY_SALARY_FACTORS: Record<Country, CountrySalaryFactor> = {
  'United States': { meanScale: 1.0, stdDevScale: 1.0 },
  Australia: { meanScale: 0.9, stdDevScale: 0.95 },
  Canada: { meanScale: 0.88, stdDevScale: 0.95 },
  Germany: { meanScale: 0.92, stdDevScale: 0.95 },
  'United Kingdom': { meanScale: 0.82, stdDevScale: 0.92 },
  India: { meanScale: 0.35, stdDevScale: 0.85 },
};

function scaleSalaryAmount(amount: number, scale: number): number {
  return Math.round((amount * scale) / 500) * 500;
}

function getBaseSalaryProfile(jobTitle: JobTitle): SalaryProfile {
  const department = JOB_TITLE_DEPARTMENTS[jobTitle];
  const band = DEPARTMENT_SALARY_BANDS[department];
  const adjustment = JOB_TITLE_SALARY_ADJUSTMENTS[jobTitle];

  return {
    mean: band.mean + adjustment.meanOffset,
    stdDev: band.stdDev * adjustment.stdDevScale,
    min: adjustment.min,
    max: adjustment.max,
  };
}

export function getSalaryProfile(jobTitle: JobTitle, country: Country): SalaryProfile {
  const base = getBaseSalaryProfile(jobTitle);
  const factor = COUNTRY_SALARY_FACTORS[country];

  return {
    mean: base.mean * factor.meanScale,
    stdDev: base.stdDev * factor.stdDevScale,
    min: scaleSalaryAmount(base.min, factor.meanScale),
    max: scaleSalaryAmount(base.max, factor.meanScale),
  };
}

export const SALARY_PROFILES: Record<JobTitle, SalaryProfile> = Object.fromEntries(
  JOB_TITLES.map((jobTitle) => [jobTitle, getSalaryProfile(jobTitle, 'United States')]),
) as Record<JobTitle, SalaryProfile>;

/** Min/max bounds per title — derived from salary profiles for range checks. */
export const SALARY_RANGES: Record<JobTitle, SalaryRange> = Object.fromEntries(
  JOB_TITLES.map((jobTitle) => {
    const { min, max } = SALARY_PROFILES[jobTitle];

    return [jobTitle, { min, max }];
  }),
) as Record<JobTitle, SalaryRange>;
