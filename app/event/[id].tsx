/**
 * Event Detail Screen
 * Shows full event details with correlated commits
 */

import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { CorrelationList } from '@/components/correlation-list';
import { EventCard } from '@/components/event-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ErrorFallback } from '@/components/ui/error-boundary';
import { useEvent } from '@/hooks/use-events';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  const { data: event, isLoading, isError, refetch } = useEvent(id);

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={tintColor} />
      </ThemedView>
    );
  }

  if (isError || !event) {
    return (
      <ErrorFallback
        message="Event not found"
        onRetry={() => refetch()}
      />
    );
  }

  const formatFullTimestamp = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getEventTypeLabel = () => {
    switch (event.type) {
      case 'alert':
        return 'Alert';
      case 'deploy':
        return 'Deployment';
      case 'usage_spike':
        return 'Usage Spike';
      default:
        return 'Event';
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: getEventTypeLabel(),
          headerBackTitle: 'Feed',
        }}
      />
      <ThemedView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Event Card */}
          <EventCard event={event} style={styles.eventCard} />

          {/* Timestamp */}
          <View style={styles.timestampContainer}>
            <ThemedText style={[styles.timestampLabel, { color: iconColor }]}>
              Occurred at
            </ThemedText>
            <ThemedText style={styles.timestamp}>
              {formatFullTimestamp(event.timestamp)}
            </ThemedText>
          </View>

          {/* Metric Value (for alerts) */}
          {event.data.value !== undefined && (
            <View style={styles.metricContainer}>
              <ThemedText style={[styles.metricLabel, { color: iconColor }]}>
                {event.data.metric?.replaceAll('_', ' ').toUpperCase() || 'Value'}
              </ThemedText>
              <View style={styles.metricValueRow}>
                <ThemedText style={styles.metricValue}>
                  {event.data.value}
                </ThemedText>
                {event.data.previousValue !== undefined && (
                  <ThemedText style={[styles.metricPrevious, { color: iconColor }]}>
                    (was {event.data.previousValue})
                  </ThemedText>
                )}
              </View>
            </View>
          )}

          {/* Correlated Commits */}
          {event.correlatedCommits && event.correlatedCommits.length > 0 && (
            <View style={styles.correlationSection}>
              <ThemedText style={[styles.sectionTitle, { color: iconColor }]}>
                Possible Causes
              </ThemedText>
              <ThemedText style={[styles.sectionSubtitle, { color: iconColor }]}>
                Commits deployed within ±2 hours of this event
              </ThemedText>
              <CorrelationList
                commits={event.correlatedCommits}
                style={styles.correlationList}
              />
            </View>
          )}

          {/* Source Info */}
          <View style={styles.sourceSection}>
            <ThemedText style={[styles.sourceLabel, { color: iconColor }]}>
              Source
            </ThemedText>
            <ThemedText style={styles.sourceValue}>
              {event.source.charAt(0).toUpperCase() + event.source.slice(1)}
            </ThemedText>
          </View>
        </ScrollView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  eventCard: {
    marginBottom: 24,
  },
  timestampContainer: {
    marginBottom: 20,
  },
  timestampLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 16,
    fontWeight: '600',
  },
  metricContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  metricPrevious: {
    fontSize: 14,
  },
  correlationSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginBottom: 16,
  },
  correlationList: {
    marginTop: 0,
  },
  sourceSection: {
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e5e5',
  },
  sourceLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sourceValue: {
    fontSize: 16,
    fontWeight: '500',
  },
});
