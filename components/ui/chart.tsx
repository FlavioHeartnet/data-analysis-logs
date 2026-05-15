/**
 * MetricChart Component
 * Simple line chart for metric trends using react-native-svg
 */

import { StyleSheet, View, type ViewProps } from 'react-native';
import Svg, { Circle, G, Line, Path, Text as SvgText } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

export type DataPoint = {
  x: string; // ISO date string
  y: number;
};

export type MetricChartProps = ViewProps & {
  data: DataPoint[];
  title?: string;
  height?: number;
  color?: string;
  showDots?: boolean;
  showGrid?: boolean;
  lightColor?: string;
  darkColor?: string;
};

export function MetricChart({
  style,
  lightColor,
  darkColor,
  data,
  title,
  height = 150,
  color,
  showDots = true,
  showGrid = true,
  ...otherProps
}: MetricChartProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor ?? '#f8f9fa', dark: darkColor ?? '#1c1c1e' },
    'background'
  );
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');
  const chartColor = color || tintColor;

  if (!data || data.length < 2) {
    return (
      <View style={[{ backgroundColor }, styles.emptyContainer, style]}>
        <ThemedText style={[styles.emptyText, { color: iconColor }]}>
          Not enough data
        </ThemedText>
      </View>
    );
  }

  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = 320; // Will scale with viewBox
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate min/max values
  const values = data.map(d => d.y);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1;
  const paddedMin = minValue - valueRange * 0.1;
  const paddedMax = maxValue + valueRange * 0.1;
  const paddedRange = paddedMax - paddedMin;

  // Map data points to coordinates
  const points = data.map((point, index) => ({
    x: padding.left + (index / (data.length - 1)) * chartWidth,
    y: padding.top + chartHeight - ((point.y - paddedMin) / paddedRange) * chartHeight,
    value: point.y,
  }));

  // Create SVG path
  const pathD = points.reduce((acc, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }
    // Smooth curve using quadratic bezier
    const prev = points[index - 1];
    const midX = (prev.x + point.x) / 2;
    return `${acc} Q ${prev.x} ${prev.y} ${midX} ${(prev.y + point.y) / 2} T ${point.x} ${point.y}`;
  }, '');

  // Grid lines (horizontal)
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(ratio => ({
    y: padding.top + chartHeight * (1 - ratio),
    value: paddedMin + paddedRange * ratio,
  }));

  return (
    <View style={[{ backgroundColor }, styles.container, style]} {...otherProps}>
      {title && (
        <ThemedText style={[styles.title, { color: iconColor }]}>
          {title}
        </ThemedText>
      )}
      <Svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid */}
        {showGrid && (
          <G>
            {gridLines.map((line, index) => (
              <G key={index}>
                <Line
                  x1={padding.left}
                  y1={line.y}
                  x2={width - padding.right}
                  y2={line.y}
                  stroke={iconColor}
                  strokeOpacity={0.15}
                  strokeDasharray="4,4"
                />
                <SvgText
                  x={padding.left - 8}
                  y={line.y + 4}
                  fontSize={10}
                  fill={iconColor}
                  textAnchor="end"
                >
                  {line.value.toFixed(1)}
                </SvgText>
              </G>
            ))}
          </G>
        )}

        {/* Line */}
        <Path
          d={pathD}
          fill="none"
          stroke={chartColor}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots */}
        {showDots && (
          <G>
            {points.map((point, index) => (
              <Circle
                key={index}
                cx={point.x}
                cy={point.y}
                r={4}
                fill={backgroundColor}
                stroke={chartColor}
                strokeWidth={2}
              />
            ))}
          </G>
        )}

        {/* Current value highlight */}
        {points.length > 0 && (
          <G>
            <Circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r={6}
              fill={chartColor}
            />
          </G>
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    paddingBottom: 8,
  },
  emptyContainer: {
    borderRadius: 16,
    padding: 24,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
});
