/**
 * MetricCard Component
 * Apple Health-style metric display with big number and trend indicator
 */

import { StyleSheet, View, type ViewProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

export type MetricCardProps = ViewProps & {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  trendIsGood?: boolean; // Whether the trend direction is positive
  lightColor?: string;
  darkColor?: string;
};

export function MetricCard({
  style,
  lightColor,
  darkColor,
  title,
  value,
  unit,
  trend,
  trendValue,
  trendIsGood = true,
  ...otherProps
}: MetricCardProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor ?? '#f8f9fa', dark: darkColor ?? '#1c1c1e' },
    'background'
  );
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '→';
    }
  };

  const getTrendColor = () => {
    if (trend === 'stable') return iconColor;
    const isPositive = trend === 'up' ? trendIsGood : !trendIsGood;
    return isPositive ? '#22c55e' : '#ef4444';
  };

  return (
    <View
      style={[{ backgroundColor }, styles.container, style]}
      {...otherProps}
    >
      <ThemedText style={[styles.title, { color: iconColor }]}>
        {title}
      </ThemedText>
      
      <View style={styles.valueRow}>
        <ThemedText style={[styles.value, { color: textColor }]}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </ThemedText>
        {!!(unit) && (
          <ThemedText style={[styles.unit, { color: iconColor }]}>
            {unit}
          </ThemedText>
        )}
      </View>

      {trend && !!(trendValue) && (
        <View style={styles.trendRow}>
          <ThemedText style={[styles.trendIcon, { color: getTrendColor() }]}>
            {getTrendIcon()}
          </ThemedText>
          <ThemedText style={[styles.trendValue, { color: getTrendColor() }]}>
            {trendValue}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    flexGrow: 1,
    flexShrink: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -1,
  },
  unit: {
    fontSize: 16,
    fontWeight: '500',
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  trendIcon: {
    fontSize: 14,
    fontWeight: '600',
  },
  trendValue: {
    fontSize: 13,
    fontWeight: '500',
  },
});
