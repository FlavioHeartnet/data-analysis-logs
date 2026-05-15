/**
 * EventCard Component
 * Displays alerts, deploys, and usage events in a card format
 */

import { StyleSheet, TouchableOpacity, View, type ViewProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Event } from '@/services/mock-data';

export type EventCardProps = ViewProps & {
  event: Event;
  onPress?: () => void;
  lightColor?: string;
  darkColor?: string;
};

export function EventCard({
  style,
  lightColor,
  darkColor,
  event,
  onPress,
  ...otherProps
}: EventCardProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor ?? '#ffffff', dark: darkColor ?? '#1c1c1e' },
    'background'
  );
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');

  const formatTimestamp = (isoDate: string): string => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  const getTypeIcon = () => {
    switch (event.type) {
      case 'alert':
        return '🚨';
      case 'deploy':
        return '🚀';
      case 'usage_spike':
        return '📈';
      default:
        return '📋';
    }
  };

  const getSeverityColor = () => {
    if (event.type !== 'alert') return tintColor;
    switch (event.data.severity) {
      case 'critical':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'info':
        return '#3b82f6';
      default:
        return iconColor;
    }
  };

  const getStatusBadge = () => {
    if (event.type !== 'alert' || !event.data.status) return null;
    const isResolved = event.data.status === 'resolved';
    return (
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: isResolved ? '#22c55e20' : '#ef444420' },
        ]}
      >
        <ThemedText
          style={[
            styles.statusText,
            { color: isResolved ? '#22c55e' : '#ef4444' },
          ]}
        >
          {isResolved ? 'Resolved' : 'Firing'}
        </ThemedText>
      </View>
    );
  };

  const content = (
    <View
      style={[{ backgroundColor }, styles.container, style]}
      {...otherProps}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <ThemedText style={styles.icon}>{getTypeIcon()}</ThemedText>
        </View>
        <View style={styles.headerText}>
          <View style={styles.titleRow}>
            <ThemedText
              style={[styles.title, { color: textColor }]}
              numberOfLines={1}
            >
              {event.data.title}
            </ThemedText>
            {getStatusBadge()}
          </View>
          <ThemedText style={[styles.source, { color: iconColor }]}>
            {event.source.charAt(0).toUpperCase() + event.source.slice(1)} •{' '}
            {formatTimestamp(event.timestamp)}
          </ThemedText>
        </View>
        {event.type === 'alert' && (
          <View
            style={[
              styles.severityDot,
              { backgroundColor: getSeverityColor() },
            ]}
          />
        )}
      </View>

      {event.data.description && (
        <ThemedText
          style={[styles.description, { color: iconColor }]}
          numberOfLines={2}
        >
          {event.data.description}
        </ThemedText>
      )}

      {event.correlatedCommits && event.correlatedCommits.length > 0 && (
        <View style={styles.correlationHint}>
          <ThemedText style={[styles.correlationText, { color: tintColor }]}>
            {event.correlatedCommits.length} related commit
            {event.correlatedCommits.length > 1 ? 's' : ''} →
          </ThemedText>
        </View>
      )}

      {event.type === 'deploy' && event.data.version && (
        <View style={styles.versionBadge}>
          <ThemedText style={[styles.versionText, { color: tintColor }]}>
            {event.data.version}
          </ThemedText>
          {event.data.commitCount && (
            <ThemedText style={[styles.commitCount, { color: iconColor }]}>
              • {event.data.commitCount} commits
            </ThemedText>
          )}
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  headerText: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  source: {
    fontSize: 13,
    marginTop: 2,
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    marginTop: 6,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  correlationHint: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e5e5',
  },
  correlationText: {
    fontSize: 13,
    fontWeight: '500',
  },
  versionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 4,
  },
  versionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  commitCount: {
    fontSize: 13,
  },
});
