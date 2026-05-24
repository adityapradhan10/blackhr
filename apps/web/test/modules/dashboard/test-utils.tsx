import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { DashboardPage } from '../../../src/modules/dashboard/views/dashboard-page';

const queryClientOptions = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 30_000,
    },
  },
} as const;

function createTestQueryClient() {
  return new QueryClient(queryClientOptions);
}

type RenderDashboardPageOptions = Omit<RenderOptions, 'wrapper'>;

export function renderDashboardPage(options: RenderDashboardPageOptions = {}) {
  const queryClient = createTestQueryClient();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/dashboard']}>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  }

  return {
    queryClient,
    ...render(<DashboardPage />, { wrapper: Wrapper, ...options }),
  };
}
