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
  it('renders the application shell without placeholder pages', () => {
    window.history.pushState({}, '', '/');

    render(<App />);

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('does not fetch application data before feature pages exist', () => {
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

    render(<App />);

    expect(adapter).not.toHaveBeenCalled();
  });
});
