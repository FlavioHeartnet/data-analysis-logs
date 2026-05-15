/**
 * SyncStatus Component
 * Shows last synced status for integrations
 */

import { ActivityIndicator, StyleSheet, TouchableOpacity, View, type ViewProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { SyncStatus as SyncStatusType } from '@/services/mock-data';

export type SyncStatusProps = ViewProps & {
  status: SyncStatusType | undefined;
  onSync?: (integration: 'grafana' | 'github') => void;
  isSyncing?: boolean;
  lightColor?: string;
  darkColor?: string;
};

export function SyncStatus({
  style,
  lightColor,
  darkColor,
  status,
  onSync,
  isSyncing = false,
  ...otherProps
}: SyncStatusProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor ?? '#f8f9fa', dark: darkColor ?? '#1c1c1e' },
    'background'
  );
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');

  const formatLastSynced = (isoDate: string): string => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getStatusColor = (integrationStatus: string) => {
    switch (integrationStatus) {
      case 'synced':
        return '#22c55e';
      case 'syncing':
        return '#f59e0b';
      case 'error':
        return '#ef4444';
      default:
        return iconColor;
    }
  };

  if (!status) {
    return (
      <View style={[{ backgroundColor }, styles.container, style]} {...otherProps}>
        <ActivityIndicator size="small" color={tintColor} />
      </View>
    );
  }

  const integrations: Array<{
    key: 'grafana' | 'github';
    name: string;
    icon: string;
    data: typeof status.grafana;
  }> = [
    { key: 'grafana', name: 'Grafana', icon: '📊', data: status.grafana },
    { key: 'github', name: 'GitHub', icon: '🐙', data: status.github },
  ];

  return (
    <View style={[{ backgroundColor }, styles.container, style]} {...otherProps}>
      <ThemedText style={[styles.header, { color: iconColor }]}>
        Integrations
      </ThemedText>

      {integrations.map((integration) => (
        <View key={integration.key} style={styles.integrationRow}>
          <View style={styles.integrationInfo}>
            <ThemedText style={styles.integrationIcon}>
              {integration.icon}
            </ThemedText>
            <View>
              <ThemedText style={[styles.integrationName, { color: textColor }]}>
                {integration.name}
              </ThemedText>
              <ThemedText style={[styles.lastSynced, { color: iconColor }]}>
                {formatLastSynced(integration.data.lastSyncedAt)} •{' '}
                {integration.data.eventsCount} events
              </ThemedText>
            </View>
          </View>

          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(integration.data.status) },
              ]}
            />
            {onSync && (
              <TouchableOpacity
                onPress={() => onSync(integration.key)}
                disabled={isSyncing}
                style={styles.syncButton}
              >
                {isSyncing ? (
                  <ActivityIndicator size="small" color={tintColor} />
                ) : (
                  <ThemedText style={[styles.syncText, { color: tintColor }]}>
                    Sync
                  </ThemedText>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
  },
  header: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  integrationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
  },
  integrationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  integrationIcon: {
    fontSize: 24,
  },
  integrationName: {
    fontSize: 15,
    fontWeight: '600',
  },
  lastSynced: {
    fontSize: 12,
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  syncButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 50,
    alignItems: 'center',
  },
  syncText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
