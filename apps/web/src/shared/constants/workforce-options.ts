export const COUNTRY_OPTIONS = [
  'India',
  'United States',
  'United Kingdom',
  'Germany',
  'Canada',
] as const;

export const DEPARTMENT_OPTIONS = [
  'Engineering',
  'Product',
  'Design',
  'Sales',
  'HR',
  'Finance',
] as const;

export const JOB_TITLE_OPTIONS = [
  'Software Engineer',
  'Product Manager',
  'Designer',
  'Sales Executive',
  'HR Manager',
] as const;

export const FILTER_COUNTRY_OPTIONS = ['', ...COUNTRY_OPTIONS] as const;
export const FILTER_DEPARTMENT_OPTIONS = ['', ...DEPARTMENT_OPTIONS] as const;
export const FILTER_JOB_TITLE_OPTIONS = ['', ...JOB_TITLE_OPTIONS] as const;

export const FORM_COUNTRY_OPTIONS = COUNTRY_OPTIONS;
export const FORM_DEPARTMENT_OPTIONS = DEPARTMENT_OPTIONS;
export const FORM_JOB_TITLE_OPTIONS = JOB_TITLE_OPTIONS;
