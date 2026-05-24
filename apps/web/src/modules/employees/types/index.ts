import { EMPLOYMENT_TYPES, type EmploymentType } from '@blackhr/shared-types';
import { z } from 'zod/v4';
import {
  FILTER_COUNTRY_OPTIONS,
  FILTER_DEPARTMENT_OPTIONS,
  FILTER_JOB_TITLE_OPTIONS,
  FORM_COUNTRY_OPTIONS,
  FORM_DEPARTMENT_OPTIONS,
  FORM_JOB_TITLE_OPTIONS,
} from '../../../shared/constants/workforce-options';

export {
  FILTER_COUNTRY_OPTIONS,
  FILTER_DEPARTMENT_OPTIONS,
  FILTER_JOB_TITLE_OPTIONS,
  FORM_COUNTRY_OPTIONS,
  FORM_DEPARTMENT_OPTIONS,
  FORM_JOB_TITLE_OPTIONS,
};

export type EmployeeFilters = {
  country: string;
  department: string;
  jobTitle: string;
};

export const EMPTY_EMPLOYEE_FILTERS: EmployeeFilters = {
  country: '',
  department: '',
  jobTitle: '',
};

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  CONTRACT: 'Contract',
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
};

export const EMPLOYMENT_TYPE_OPTIONS = EMPLOYMENT_TYPES.map((value) => ({
  label: EMPLOYMENT_TYPE_LABELS[value],
  value,
}));

export const employeeFormSchema = z.object({
  country: z.string().trim().min(1, 'Country is required'),
  department: z.string().trim().min(1, 'Department is required'),
  email: z.string().trim().email('Enter a valid email address'),
  employmentType: z.enum(EMPLOYMENT_TYPES),
  fullName: z.string().trim().min(1, 'Full name is required'),
  jobTitle: z.string().trim().min(1, 'Job title is required'),
  joiningDate: z.string().trim().min(1, 'Joining date is required'),
  salary: z.number().min(1, 'Salary must be greater than zero'),
});

export type EmployeeFormValues = z.output<typeof employeeFormSchema>;
