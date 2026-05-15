---
name: expo-screen
description: 'Scaffold new Expo Router screens with proper layout integration and typed routes. Use when creating new screens, pages, tabs, or modals in the app directory.'
argument-hint: 'screen name and type (tab/modal/stack)'
---

# Expo Screen Scaffolding

## When to Use

- Creating new screens in the `app/` directory
- Adding tabs to the bottom navigation
- Creating modal screens
- Setting up nested navigators

## Screen Types

### Tab Screen

Add to `app/(tabs)/` and update `app/(tabs)/_layout.tsx`:

```tsx
// app/(tabs)/settings.tsx
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function SettingsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Settings</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
```

Then add tab in layout:

```tsx
// Add to app/(tabs)/_layout.tsx
<Tabs.Screen
  name="settings"
  options={{
    title: 'Settings',
    tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
  }}
/>
```

### Modal Screen

Create at `app/` root level:

```tsx
// app/details.tsx
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function DetailsModal() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Details</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
```

Register in root layout:

```tsx
// Add to app/_layout.tsx Stack
<Stack.Screen name="details" options={{ presentation: 'modal', title: 'Details' }} />
```

### Stack Screen (in a group)

Create a route group folder:

```tsx
// app/(auth)/login.tsx
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function LoginScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Login</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
```

## Procedure

1. Determine screen type (tab/modal/stack)
2. Create the screen file with kebab-case naming
3. Use `ThemedView` as root container
4. Add `ThemedText` for text content
5. Include `StyleSheet` for styles
6. Register in appropriate `_layout.tsx`
7. For tabs, add `tabBarIcon` with SF Symbol

## Navigation

```tsx
import { router } from 'expo-router';

// Navigate
router.push('/details');
router.replace('/login');
router.back();

// With params (typed routes)
router.push({ pathname: '/user/[id]', params: { id: '123' } });
```

## SF Symbol Icons for Tabs

Common icons: `house.fill`, `gearshape.fill`, `person.fill`, `magnifyingglass`, `bell.fill`, `chart.bar.fill`, `folder.fill`, `heart.fill`
