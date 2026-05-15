/**
 * Metrics Hook
 * Fetches metrics summary and chart data
 */

import {
    fetchChartData,
    fetchMetricsSummary,
} from '@/services/events';
import type { MetricsSummary } from '@/services/mock-data';
import { useQuery } from '@tanstack/react-query';

const METRICS_STALE_TIME = 60 * 1000; // 1 minute

export function useMetrics() {
  return useQuery<MetricsSummary>({
    queryKey: ['metrics'],
    queryFn: fetchMetricsSummary,
    staleTime: METRICS_STALE_TIME,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

export function useChartData(metric: 'errorRate' | 'latency' | 'activeUsers') {
  return useQuery({
    queryKey: ['chartData', metric],
    queryFn: () => fetchChartData(metric),
    staleTime: METRICS_STALE_TIME,
  });
}
