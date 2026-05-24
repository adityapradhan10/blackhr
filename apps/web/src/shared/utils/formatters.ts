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
