/**
 * TimelineFeed Component
 * Scrollable list of events with pull-to-refresh
 */

import { useCallback } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    View,
    type ViewProps,
} from 'react-native';

import { EventCard } from '@/components/event-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Event } from '@/services/mock-data';

export type TimelineFeedProps = ViewProps & {
  events: Event[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  hasMore?: boolean;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  onEventPress?: (event: Event) => void;
  emptyMessage?: string;
  lightColor?: string;
  darkColor?: string;
  ListHeaderComponent?: React.ComponentType | React.ReactElement | null;
};

export function TimelineFeed({
  style,
  lightColor,
  darkColor,
  events,
  isLoading = false,
  isRefreshing = false,
  hasMore = false,
  onRefresh,
  onLoadMore,
  onEventPress,
  emptyMessage = 'No events yet',
  ListHeaderComponent,
  ...otherProps
}: TimelineFeedProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  );
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  const renderItem = useCallback(
    ({ item }: { item: Event }) => (
      <EventCard
        event={item}
        onPress={onEventPress ? () => onEventPress(item) : undefined}
        style={styles.eventCard}
      />
    ),
    [onEventPress]
  );

  const keyExtractor = useCallback((item: Event) => item.id, []);

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={tintColor} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={tintColor} />
          <ThemedText style={[styles.emptyText, { color: iconColor }]}>
            Loading events...
          </ThemedText>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <ThemedText style={styles.emptyIcon}>📭</ThemedText>
        <ThemedText style={[styles.emptyText, { color: iconColor }]}>
          {emptyMessage}
        </ThemedText>
      </View>
    );
  };

  return (
    <ThemedView style={[{ backgroundColor }, styles.container, style]} {...otherProps}>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[
          styles.listContent,
          events.length === 0 && styles.emptyList,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={tintColor}
            />
          ) : undefined
        }
        onEndReached={hasMore ? onLoadMore : undefined}
        onEndReachedThreshold={0.3}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
  eventCard: {
    marginBottom: 0,
  },
  separator: {
    height: 12,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
