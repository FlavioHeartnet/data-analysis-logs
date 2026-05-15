/**
 * Skeleton Component
 * Loading placeholder with shimmer effect
 */

import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type SkeletonProps = ViewProps & {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  lightColor?: string;
  darkColor?: string;
};

export function Skeleton({
  style,
  lightColor,
  darkColor,
  width = '100%',
  height = 20,
  borderRadius = 8,
  ...otherProps
}: SkeletonProps) {
  const baseColor = useThemeColor(
    { light: lightColor ?? '#e5e5e5', dark: darkColor ?? '#2c2c2e' },
    'background'
  );

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  return (
    <Animated.View
      style={[
        {
          backgroundColor: baseColor,
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}

// Pre-composed skeleton components
export function SkeletonMetricCard() {
  return (
    <View style={skeletonStyles.metricCard}>
      <Skeleton width={80} height={12} />
      <Skeleton width={60} height={32} style={{ marginTop: 8 }} />
      <Skeleton width={50} height={14} style={{ marginTop: 8 }} />
    </View>
  );
}

export function SkeletonEventCard() {
  return (
    <View style={skeletonStyles.eventCard}>
      <View style={skeletonStyles.eventHeader}>
        <Skeleton width={40} height={40} borderRadius={10} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Skeleton width="70%" height={16} />
          <Skeleton width="40%" height={12} style={{ marginTop: 6 }} />
        </View>
      </View>
      <Skeleton width="100%" height={14} style={{ marginTop: 12 }} />
      <Skeleton width="80%" height={14} style={{ marginTop: 6 }} />
    </View>
  );
}

export function SkeletonFeed() {
  return (
    <View style={skeletonStyles.feed}>
      <View style={skeletonStyles.metricsRow}>
        <SkeletonMetricCard />
        <SkeletonMetricCard />
      </View>
      <SkeletonEventCard />
      <SkeletonEventCard />
      <SkeletonEventCard />
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  metricCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'transparent',
    flex: 1,
  },
  eventCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feed: {
    padding: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
});
