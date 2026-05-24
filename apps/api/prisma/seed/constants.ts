import {
  COUNTRY_OPTIONS,
  DEPARTMENT_OPTIONS,
  EMPLOYMENT_TYPES,
  JOB_TITLE_OPTIONS,
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
