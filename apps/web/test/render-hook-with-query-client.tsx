import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, type RenderHookOptions, type RenderHookResult } from '@testing-library/react';
import type { ReactNode } from 'react';

const queryClientOptions = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 30_000,
    },
  },
} as const;

export function createTestQueryClient() {
  return new QueryClient(queryClientOptions);
}

export function createQueryClientWrapper(queryClient = createTestQueryClient()) {
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  return { queryClient, Wrapper };
}

export function renderHookWithQueryClient<Result, Props>(
  callback: (initialProps: Props) => Result,
  options: RenderHookOptions<Props> = {},
) {
  const { queryClient, Wrapper } = createQueryClientWrapper();

  const hookResult = renderHook(callback, {
    ...options,
    wrapper: Wrapper,
  });

  return { queryClient, ...hookResult };
}

export type HookRenderResult<Result, Props> = RenderHookResult<Result, Props> & {
  queryClient: QueryClient;
};
