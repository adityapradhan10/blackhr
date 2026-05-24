import { isAxiosError } from 'axios';

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (!isAxiosError(error)) {
    return fallback;
  }

  const message = error.response?.data?.message;

  if (typeof message === 'string' && message.trim()) {
    return message;
  }

  if (Array.isArray(message) && message.length > 0) {
    return message.join(', ');
  }

  if (error.response?.status === 409) {
    return 'Employee email already exists.';
  }

  return fallback;
}
