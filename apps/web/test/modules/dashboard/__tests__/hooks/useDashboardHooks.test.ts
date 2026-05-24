import type { AxiosAdapter } from 'axios';
import { waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useCountryInsights } from '../../../../../src/modules/dashboard/hooks/useCountryInsights';
import { useDashboardMetrics } from '../../../../../src/modules/dashboard/hooks/useDashboardMetrics';
import { useJobTitleInsights } from '../../../../../src/modules/dashboard/hooks/useJobTitleInsights';
import { api } from '../../../../../src/shared/services/api';
import { renderHookWithQueryClient } from '../../../../render-hook-with-query-client';
import { indiaCountryInsight, mockSalaryInsightApi, sampleDashboardMetrics, softwareEngineerInsight } from '../mocks';

const originalAdapter = api.defaults.adapter;

afterEach(() => {
  api.defaults.adapter = originalAdapter;
});

describe('dashboard React Query hooks', () => {
  it('returns dashboard metrics from the API', async () => {
    mockSalaryInsightApi({});

    const { result } = renderHookWithQueryClient(() => useDashboardMetrics());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(sampleDashboardMetrics);
  });

  it('returns country insights for the selected country', async () => {
    mockSalaryInsightApi({});

    const { result } = renderHookWithQueryClient(() => useCountryInsights('India'));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(indiaCountryInsight);
  });

  it('returns job title insights for the selected role and country', async () => {
    mockSalaryInsightApi({});

    const { result } = renderHookWithQueryClient(() => useJobTitleInsights('India', 'Software Engineer'));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(softwareEngineerInsight);
  });

  it('handles query errors correctly', async () => {
    api.defaults.adapter = vi.fn<AxiosAdapter>(async (config) => Promise.reject(new Error('Network error')));

    const { result } = renderHookWithQueryClient(() => useDashboardMetrics());

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeTruthy();
  });

  it('does not fetch country insights when country is blank', async () => {
    const adapter = mockSalaryInsightApi({});

    const { result } = renderHookWithQueryClient(() => useCountryInsights(''));

    await waitFor(() => {
      expect(result.current.fetchStatus).toBe('idle');
    });

    expect(result.current.data).toBeUndefined();
    expect(adapter).not.toHaveBeenCalled();
  });
});
