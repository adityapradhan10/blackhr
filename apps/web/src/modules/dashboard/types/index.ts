export const DASHBOARD_COUNTRY_OPTIONS = [
  'India',
  'United States',
  'United Kingdom',
  'Germany',
  'Canada',
] as const;

export const DASHBOARD_JOB_TITLE_OPTIONS = [
  'Software Engineer',
  'Product Manager',
  'Designer',
  'Sales Executive',
  'HR Manager',
] as const;

export type DashboardCountry = (typeof DASHBOARD_COUNTRY_OPTIONS)[number];

export type DashboardJobTitle = (typeof DASHBOARD_JOB_TITLE_OPTIONS)[number];

export function formatCurrency(value: number | null | undefined, currency = 'USD') {
  if (value === null || value === undefined) {
    return '—';
  }

  return new Intl.NumberFormat('en-US', {
    currency,
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value);
}

export function formatCount(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return '—';
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatLabel(value: string | null | undefined) {
  if (!value) {
    return '—';
  }

  return value;
}
