/**
 * CorrelationList Component
 * Shows commits correlated to an event/alert
 */

import { Image, Linking, StyleSheet, TouchableOpacity, View, type ViewProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { CorrelatedCommit } from '@/services/mock-data';

export type CorrelationListProps = ViewProps & {
  commits: CorrelatedCommit[];
  lightColor?: string;
  darkColor?: string;
};

export function CorrelationList({
  style,
  lightColor,
  darkColor,
  commits,
  ...otherProps
}: CorrelationListProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor ?? '#f8f9fa', dark: darkColor ?? '#1c1c1e' },
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

    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const handleCommitPress = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.warn('Failed to open URL:', url);
    }
  };

  if (commits.length === 0) {
    return (
      <View style={[{ backgroundColor }, styles.emptyContainer, style]} {...otherProps}>
        <ThemedText style={[styles.emptyText, { color: iconColor }]}>
          No correlated commits found
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={[{ backgroundColor }, styles.container, style]} {...otherProps}>
      <ThemedText style={[styles.header, { color: iconColor }]}>
        Related Commits ({commits.length})
      </ThemedText>

      {commits.map((commit, index) => (
        <TouchableOpacity
          key={commit.sha}
          style={[
            styles.commitItem,
            index < commits.length - 1 && styles.commitItemBorder,
          ]}
          onPress={() => handleCommitPress(commit.url)}
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: commit.authorAvatar }}
            style={styles.avatar}
          />
          <View style={styles.commitContent}>
            <ThemedText
              style={[styles.commitMessage, { color: textColor }]}
              numberOfLines={2}
            >
              {commit.message}
            </ThemedText>
            <View style={styles.commitMeta}>
              <ThemedText style={[styles.sha, { color: tintColor }]}>
                {commit.sha.slice(0, 7)}
              </ThemedText>
              <ThemedText style={[styles.author, { color: iconColor }]}>
                {commit.author}
              </ThemedText>
              <ThemedText style={[styles.timestamp, { color: iconColor }]}>
                • {formatTimestamp(commit.timestamp)}
              </ThemedText>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
  },
  emptyContainer: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  header: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  commitItem: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  commitItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: '#e5e5e5',
  },
  commitContent: {
    flex: 1,
  },
  commitMessage: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 4,
  },
  commitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sha: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  author: {
    fontSize: 12,
  },
  timestamp: {
    fontSize: 12,
  },
});
