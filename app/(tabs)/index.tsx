/**
 * Feed Screen (Home)
 * Main dashboard showing metrics summary and event timeline
 */

import { router } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { MetricCard } from '@/components/metric-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TimelineFeed } from '@/components/timeline-feed';
import { ErrorFallback } from '@/components/ui/error-boundary';
import { SkeletonFeed } from '@/components/ui/skeleton';
import { useFlatEvents } from '@/hooks/use-events';
import { useMetrics } from '@/hooks/use-metrics';
import { useSyncStatus } from '@/hooks/use-sync-status';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Event } from '@/services/mock-data';

export default function FeedScreen() {
  const iconColor = useThemeColor({}, 'icon');

  const {
    events,
    isLoading: isLoadingEvents,
    isRefetching,
    refetch: refetchEvents,
    fetchNextPage,
    hasNextPage,
    isError: isEventsError,
  } = useFlatEvents();

  const {
    data: metrics,
    isLoading: isLoadingMetrics,
    refetch: refetchMetrics,
  } = useMetrics();

  const { status: syncStatus, formatLastSynced } = useSyncStatus();

  const handleRefresh = useCallback(() => {
    refetchEvents();
    refetchMetrics();
  }, [refetchEvents, refetchMetrics]);

  const handleEventPress = useCallback((event: Event) => {
    router.push(`/event/${event.id}`);
  }, []);

  const isLoading = isLoadingEvents || isLoadingMetrics;

  if (isEventsError) {
    return (
      <ErrorFallback
        message="Failed to load events"
        onRetry={handleRefresh}
      />
    );
  }

  if (isLoading && !events.length) {
    return (
      <ThemedView style={styles.container}>
        <SkeletonFeed />
      </ThemedView>
    );
  }

  const lastSyncedText = syncStatus
    ? `Last synced ${formatLastSynced(syncStatus.grafana.lastSyncedAt)}`
    : 'Syncing...';

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.greeting}>Good morning</ThemedText>
        <ThemedText style={[styles.syncStatus, { color: iconColor }]}>
          {lastSyncedText}
        </ThemedText>
      </View>

      {/* Metrics Summary */}
      <View style={styles.metricsSection}>
        <ThemedText style={[styles.sectionTitle, { color: iconColor }]}>
          Current Health
        </ThemedText>
        <View style={styles.metricsRow}>
          <MetricCard
            title="Error Rate"
            value={metrics?.errorRate.current ?? 0}
            unit="%"
            trend={metrics?.errorRate.trend}
            trendValue={`${Math.abs((metrics?.errorRate.current ?? 0) - (metrics?.errorRate.previous ?? 0)).toFixed(1)}%`}
            trendIsGood={false}
            style={styles.metricCard}
          />
          <MetricCard
            title="Latency (P99)"
            value={metrics?.latency.current ?? 0}
            unit="ms"
            trend={metrics?.latency.trend}
            trendValue={`${Math.abs((metrics?.latency.current ?? 0) - (metrics?.latency.previous ?? 0))}ms`}
            trendIsGood={false}
            style={styles.metricCard}
          />
          <MetricCard
            title="Active Users"
            value={metrics?.activeUsers.current ?? 0}
            trend={metrics?.activeUsers.trend}
            trendValue={`${((metrics?.activeUsers.current ?? 0) - (metrics?.activeUsers.previous ?? 0)).toLocaleString()}`}
            trendIsGood={true}
            style={styles.metricCard}
          />
          <MetricCard
            title="Requests/min"
            value={metrics?.requestsPerMinute.current ?? 0}
            trend={metrics?.requestsPerMinute.trend}
            trendValue={`${(metrics?.requestsPerMinute.current ?? 0) - (metrics?.requestsPerMinute.previous ?? 0)}`}
            trendIsGood={true}
            style={styles.metricCard}
          />
        </View>
      </View>

      {/* Events Section Title */}
      <View style={styles.eventsHeader}>
        <ThemedText style={[styles.sectionTitle, { color: iconColor }]}>
          Recent Activity
        </ThemedText>
      </View>
    </>
  );

  return (
    <ThemedView style={styles.container}>
      <TimelineFeed
        events={events}
        isLoading={isLoadingEvents}
        isRefreshing={isRefetching}
        hasMore={hasNextPage}
        onRefresh={handleRefresh}
        onLoadMore={() => fetchNextPage()}
        onEventPress={handleEventPress}
        emptyMessage="No events in the last 24 hours"
        ListHeaderComponent={renderHeader}
        style={styles.timeline}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  syncStatus: {
    fontSize: 13,
  },
  metricsSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  eventsHeader: {
    marginTop: 8,
  },
  timeline: {
    flex: 1,
    marginHorizontal: 4,
  },
  metricCard: {
    flexBasis: '47%',
    flexGrow: 1,
    flexShrink: 1,
  },
});
