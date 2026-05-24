import { useQueryClient } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { QueryProvider } from '../src/shared/providers/QueryProvider';

function QueryConfigProbe() {
  const queryClient = useQueryClient();
  const defaults = queryClient.getDefaultOptions().queries;

  return (
    <dl>
      <dt>retry</dt>
      <dd>{String(defaults?.retry)}</dd>
      <dt>refetchOnWindowFocus</dt>
      <dd>{String(defaults?.refetchOnWindowFocus)}</dd>
      <dt>staleTime</dt>
      <dd>{String(defaults?.staleTime)}</dd>
    </dl>
  );
}

describe(QueryProvider.name, () => {
  it('provides the application query client defaults', () => {
    render(
      <QueryProvider>
        <QueryConfigProbe />
      </QueryProvider>,
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('false')).toBeInTheDocument();
    expect(screen.getByText('30000')).toBeInTheDocument();
  });
});
