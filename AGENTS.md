# AI Agent Instructions

## Project Overview

Expo SDK 54 + React Native 0.81 mobile app with file-based routing. Uses React 19 with new architecture and typed routes.

## Quick Commands

```bash
npm install          # Install dependencies
npx expo start       # Start dev server (press i/a/w for iOS/Android/Web)
npm run lint         # Run ESLint
npm run reset-project # Reset to blank app directory
```

## Architecture

### File-Based Routing (Expo Router)

Routes live in `app/` directory:
- `app/_layout.tsx` → Root layout (Stack navigator + ThemeProvider)
- `app/(tabs)/` → Tab navigator group
- `app/modal.tsx` → Modal screen

### Key Directories

| Path | Purpose |
|------|---------|
| `app/` | Screens and routing (file-based) |
| `components/` | Reusable components |
| `components/ui/` | Low-level UI primitives |
| `constants/` | Theme colors, fonts |
| `hooks/` | Custom hooks |

## Conventions

### Naming

- **Files**: kebab-case (`themed-view.tsx`, `use-color-scheme.ts`)
- **Components**: PascalCase exports (`ThemedView`, `HapticTab`)
- **Hooks**: camelCase with `use` prefix (`useThemeColor`)

### Imports

Use the `@/` path alias for absolute imports from project root:

```tsx
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors } from '@/constants/theme';
```

### Theme System

Use themed components for automatic dark/light mode:

```tsx
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

// Direct color access
const backgroundColor = useThemeColor({}, 'background');
```

Available theme colors: `text`, `background`, `tint`, `icon`, `tabIconDefault`, `tabIconSelected`

### Component Pattern

```tsx
import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export type MyComponentProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function MyComponent({ style, lightColor, darkColor, ...props }: MyComponentProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  return <View style={[{ backgroundColor }, style]} {...props} />;
}
```

## Tech Stack

- **Expo SDK 54** with new architecture
- **React 19** with React Compiler experiment
- **TypeScript 5.9** (strict mode)
- **Expo Router 6** with typed routes
- **React Navigation 7** (bottom tabs)
- **Reanimated 4** for animations
- **ESLint** with `eslint-config-expo`

## Platform-Specific Code

Use `.ios.tsx` / `.android.tsx` / `.web.tsx` suffixes for platform variants:

```
components/ui/
├── icon-symbol.tsx      # Default/fallback
└── icon-symbol.ios.tsx  # iOS-specific
```
