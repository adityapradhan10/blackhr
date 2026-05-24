import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { EmployeesPage } from '../../../src/modules/employees/views/employees-page';

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

type RenderEmployeesPageOptions = Omit<RenderOptions, 'wrapper'>;

export function renderEmployeesPage(options: RenderEmployeesPageOptions = {}) {
  const queryClient = createTestQueryClient();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/employees']}>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  }

  return {
    queryClient,
    ...render(<EmployeesPage />, { wrapper: Wrapper, ...options }),
  };
}
