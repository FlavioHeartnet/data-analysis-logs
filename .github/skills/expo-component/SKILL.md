---
name: expo-component
description: 'Generate themed React Native components following project conventions: kebab-case files, TypeScript props with theme support, useThemeColor hook. Use when creating new UI components.'
argument-hint: 'component name'
---

# Expo Component Generator

## When to Use

- Creating new reusable UI components
- Building themed components with light/dark mode support
- Adding to `components/` or `components/ui/` directories

## Component Template

```tsx
// components/my-component.tsx
import { View, type ViewProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type MyComponentProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  // Add custom props here
};

export function MyComponent({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: MyComponentProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  );

  return (
    <View style={[{ backgroundColor }, styles.container, style]} {...otherProps} />
  );
}

const styles = StyleSheet.create({
  container: {
    // default styles
  },
});
```

## Text Component Template

```tsx
// components/custom-text.tsx
import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type CustomTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'body' | 'caption' | 'heading';
};

export function CustomText({
  style,
  lightColor,
  darkColor,
  variant = 'body',
  ...otherProps
}: CustomTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        styles.base,
        variant === 'heading' && styles.heading,
        variant === 'caption' && styles.caption,
        style,
      ]}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontSize: 16,
    lineHeight: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
});
```

## Pressable Component Template

```tsx
// components/ui/button.tsx
import { Pressable, type PressableProps, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ButtonProps = PressableProps & {
  title: string;
  variant?: 'primary' | 'secondary';
};

export function Button({ title, variant = 'primary', style, ...otherProps }: ButtonProps) {
  const tint = useThemeColor({}, 'tint');
  const background = useThemeColor({}, 'background');

  const isPrimary = variant === 'primary';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isPrimary ? tint : background,
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
      {...otherProps}
    >
      <ThemedText
        style={[styles.text, isPrimary && { color: '#fff' }]}
      >
        {title}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
  },
});
```

## Procedure

1. Choose location:
   - `components/` for reusable components
   - `components/ui/` for primitives (buttons, inputs, cards)
2. Create file with **kebab-case** naming (`my-component.tsx`)
3. Export component with **PascalCase** name (`MyComponent`)
4. Include `lightColor`/`darkColor` props for theme overrides
5. Use `useThemeColor` hook for themed colors
6. Define styles with `StyleSheet.create()`
7. Export prop types for consumers

## Available Theme Colors

From `constants/theme.ts`:
- `text` - Primary text color
- `background` - Background color
- `tint` - Accent/brand color
- `icon` - Icon color
- `tabIconDefault` - Inactive tab icon
- `tabIconSelected` - Active tab icon

## Platform-Specific Variants

For platform-specific implementations:

```
components/ui/
├── date-picker.tsx       # Default/fallback
├── date-picker.ios.tsx   # iOS-specific
└── date-picker.android.tsx # Android-specific
```

Import normally — Metro resolves the correct file:

```tsx
import { DatePicker } from '@/components/ui/date-picker';
```
