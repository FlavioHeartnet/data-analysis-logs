/**
 * Events Service
 * Mock implementation for Phase 3 - simulates backend API
 */

import {
    mockChartData,
    mockEvents,
    mockMetrics,
    mockSyncStatus,
    type Event,
    type MetricsSummary,
    type SyncStatus,
} from './mock-data';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface EventsFilter {
  type?: 'alert' | 'deploy' | 'usage_spike';
  source?: 'grafana' | 'github';
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface EventsResponse {
  events: Event[];
  total: number;
  hasMore: boolean;
}

/**
 * Fetch events with optional filtering
 */
export async function fetchEvents(filter: EventsFilter = {}): Promise<EventsResponse> {
  await delay(600); // Simulate network latency

  let filteredEvents = [...mockEvents];

  // Apply filters
  if (filter.type) {
    filteredEvents = filteredEvents.filter(e => e.type === filter.type);
  }

  if (filter.source) {
    filteredEvents = filteredEvents.filter(e => e.source === filter.source);
  }

  if (filter.startDate) {
    const start = new Date(filter.startDate).getTime();
    filteredEvents = filteredEvents.filter(
      e => new Date(e.timestamp).getTime() >= start
    );
  }

  if (filter.endDate) {
    const end = new Date(filter.endDate).getTime();
    filteredEvents = filteredEvents.filter(
      e => new Date(e.timestamp).getTime() <= end
    );
  }

  // Sort by timestamp (newest first)
  filteredEvents.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Pagination
  const limit = filter.limit || 20;
  const offset = filter.offset || 0;
  const paginatedEvents = filteredEvents.slice(offset, offset + limit);

  return {
    events: paginatedEvents,
    total: filteredEvents.length,
    hasMore: offset + limit < filteredEvents.length,
  };
}

/**
 * Fetch single event by ID
 */
export async function fetchEventById(id: string): Promise<Event | null> {
  await delay(400);

  const event = mockEvents.find(e => e.id === id);
  return event || null;
}

/**
 * Fetch metrics summary
 */
export async function fetchMetricsSummary(): Promise<MetricsSummary> {
  await delay(500);
  return mockMetrics;
}

/**
 * Fetch sync status for integrations
 */
export async function fetchSyncStatus(): Promise<SyncStatus> {
  await delay(300);
  return mockSyncStatus;
}

/**
 * Fetch chart data for a specific metric
 */
export async function fetchChartData(
  metric: 'errorRate' | 'latency' | 'activeUsers'
): Promise<Array<{ x: string; y: number }>> {
  await delay(400);
  return mockChartData[metric];
}

/**
 * Trigger a manual sync (mock)
 */
export async function triggerSync(
  integration: 'grafana' | 'github'
): Promise<{ success: boolean; message: string }> {
  await delay(1500); // Simulate longer operation

  return {
    success: true,
    message: `${integration} sync completed successfully`,
  };
}
