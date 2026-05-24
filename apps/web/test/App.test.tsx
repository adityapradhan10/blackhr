import { render, screen } from '@testing-library/react';
import type { AxiosAdapter, AxiosResponse } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from '../src/App';
import { api } from '../src/shared/services/api';

const originalAdapter = api.defaults.adapter;

afterEach(() => {
  api.defaults.adapter = originalAdapter;
});

describe(App.name, () => {
  it('redirects the root route to the dashboard page', async () => {
    window.history.pushState({}, '', '/');

    render(<App />);

    expect(await screen.findByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /employees/i })).toBeInTheDocument();
  });

  it('does not fetch application data on the dashboard page', () => {
    const adapter = vi.fn<AxiosAdapter>(async (config): Promise<AxiosResponse> => {
      return {
        config,
        data: {},
        headers: {},
        status: 200,
        statusText: 'OK',
      };
    });
    api.defaults.adapter = adapter;

    window.history.pushState({}, '', '/dashboard');
    render(<App />);

    expect(adapter).not.toHaveBeenCalled();
  });
});
