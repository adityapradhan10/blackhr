export const SEED_EMPLOYEE_COUNT = 10_000;
export const BATCH_SIZE = 1_000;
export const FAKER_SEED = 20260523;

export const COUNTRIES = [
  'India',
  'United States',
  'Germany',
  'Canada',
  'United Kingdom',
  'Australia',
] as const;

export const DEPARTMENTS = ['Engineering', 'Product', 'HR', 'Finance', 'Sales'] as const;

export const JOB_TITLES = [
  'Software Engineer',
  'Senior Software Engineer',
  'Product Manager',
  'HR Specialist',
  'Finance Analyst',
] as const;

export const EMPLOYMENT_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT'] as const;

export type Department = (typeof DEPARTMENTS)[number];
export type JobTitle = (typeof JOB_TITLES)[number];

export type SalaryRange = {
  min: number;
  max: number;
};

export const JOB_TITLE_DEPARTMENTS: Record<JobTitle, Department> = {
  'Software Engineer': 'Engineering',
  'Senior Software Engineer': 'Engineering',
  'Product Manager': 'Product',
  'HR Specialist': 'HR',
  'Finance Analyst': 'Finance',
};

export const SALARY_RANGES: Record<JobTitle, SalaryRange> = {
  'Software Engineer': { min: 50_000, max: 120_000 },
  'Senior Software Engineer': { min: 90_000, max: 180_000 },
  'Product Manager': { min: 80_000, max: 160_000 },
  'HR Specialist': { min: 45_000, max: 90_000 },
  'Finance Analyst': { min: 55_000, max: 110_000 },
};
