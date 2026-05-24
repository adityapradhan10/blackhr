import type { EmploymentType } from '@blackhr/shared-types';
import { z } from 'zod/v4';

export const EMPLOYMENT_TYPE_OPTIONS: Array<{ label: string; value: EmploymentType }> = [
  { label: 'Full Time', value: 'FULL_TIME' },
  { label: 'Part Time', value: 'PART_TIME' },
  { label: 'Contract', value: 'CONTRACT' },
];

export const employeeFormSchema = z.object({
  country: z.string().trim().min(1, 'Country is required'),
  department: z.string().trim().min(1, 'Department is required'),
  email: z.string().trim().email('Enter a valid email address'),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT']),
  fullName: z.string().trim().min(1, 'Full name is required'),
  jobTitle: z.string().trim().min(1, 'Job title is required'),
  joiningDate: z.string().trim().min(1, 'Joining date is required'),
  salary: z.number().min(1, 'Salary must be greater than zero'),
});

export type EmployeeFormValues = z.output<typeof employeeFormSchema>;

export const FILTER_COUNTRY_OPTIONS = ['', 'India', 'United States', 'United Kingdom', 'Germany', 'Canada'] as const;
export const FILTER_DEPARTMENT_OPTIONS = ['', 'Engineering', 'Product', 'Design', 'Sales', 'HR', 'Finance'] as const;
export const FILTER_JOB_TITLE_OPTIONS = [
  '',
  'Software Engineer',
  'Product Manager',
  'Designer',
  'Sales Executive',
  'HR Manager',
] as const;

export const FORM_COUNTRY_OPTIONS = FILTER_COUNTRY_OPTIONS.filter(
  (value): value is Exclude<(typeof FILTER_COUNTRY_OPTIONS)[number], ''> => value !== '',
);
export const FORM_DEPARTMENT_OPTIONS = FILTER_DEPARTMENT_OPTIONS.filter(
  (value): value is Exclude<(typeof FILTER_DEPARTMENT_OPTIONS)[number], ''> => value !== '',
);
export const FORM_JOB_TITLE_OPTIONS = FILTER_JOB_TITLE_OPTIONS.filter(
  (value): value is Exclude<(typeof FILTER_JOB_TITLE_OPTIONS)[number], ''> => value !== '',
);
