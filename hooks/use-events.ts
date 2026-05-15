/**
 * Events Hook
 * Fetches and manages events data with React Query
 */

import {
    fetchEventById,
    fetchEvents,
    type EventsFilter,
} from '@/services/events';
import type { Event } from '@/services/mock-data';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

const EVENTS_STALE_TIME = 30 * 1000; // 30 seconds

export function useEvents(filter: EventsFilter = {}) {
  return useInfiniteQuery({
    queryKey: ['events', filter],
    queryFn: async ({ pageParam = 0 }) => {
      return fetchEvents({
        ...filter,
        offset: pageParam,
        limit: filter.limit || 20,
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;
      const totalLoaded = allPages.reduce(
        (sum, page) => sum + page.events.length,
        0
      );
      return totalLoaded;
    },
    initialPageParam: 0,
    staleTime: EVENTS_STALE_TIME,
  });
}

export function useEvent(id: string) {
  return useQuery<Event | null>({
    queryKey: ['event', id],
    queryFn: () => fetchEventById(id),
    enabled: !!id,
    staleTime: EVENTS_STALE_TIME,
  });
}

// Flatten infinite query pages to a single array
export function useFlatEvents(filter: EventsFilter = {}) {
  const query = useEvents(filter);
  
  const events = query.data?.pages.flatMap(page => page.events) ?? [];
  const total = query.data?.pages[0]?.total ?? 0;

  return {
    ...query,
    events,
    total,
  };
}
