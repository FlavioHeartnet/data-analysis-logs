# ObservaSync

A unified observability mobile app for engineering managers and tech leads. Correlates system health data from Grafana with GitHub commits to answer "what changed?" in under 30 seconds.

## Overview

Engineering managers waste time context-switching between observability tools (Grafana, Datadog, CloudWatch) to get a unified view of system health. ObservaSync provides a feed-style timeline correlating alerts and anomalies with recent deploys — all in one mobile app.

### Key Features

- **Timeline Feed** — Alerts, anomalies, and usage changes in chronological order
- **Auto-Correlation** — Links anomalies to commits within configurable time windows
- **Metric Cards** — At-a-glance APM metrics (error rate, latency, throughput)
- **Multi-Platform** — iOS, Android, and Web via Expo

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Expo SDK 54 + React Native 0.81 |
| UI | React 19 with new architecture |
| Language | TypeScript 5.9 (strict mode) |
| Routing | Expo Router 6 (file-based, typed routes) |
| Navigation | React Navigation 7 (bottom tabs) |
| State | TanStack React Query |
| HTTP | Axios |
| Charts | Victory Native |
| Animations | Reanimated 4 |
| Storage | Expo Secure Store |

## Quick Start

```bash
npm install          # Install dependencies
npx expo start       # Start dev server (press i/a/w for iOS/Android/Web)
npm run lint         # Run ESLint
```

## Project Structure

```
app/                 # Screens and routing (file-based)
├── (auth)/          # Authentication screens (login, register)
├── (tabs)/          # Tab navigator (Feed, Settings)
├── event/           # Event detail screens
└── modal.tsx        # Modal screen

components/          # Reusable components
├── ui/              # Low-level UI primitives
├── timeline-feed.tsx
├── metric-card.tsx
├── correlation-list.tsx
└── event-card.tsx

hooks/               # Custom hooks
├── use-auth.ts
├── use-events.ts
├── use-metrics.ts
└── use-sync-status.ts

services/            # API and data services
├── api.ts
├── auth.ts
├── events.ts
└── mock-data.ts

constants/           # Theme colors, fonts
docs/                # Design docs and workplan
```

## Conventions

### Naming

- **Files**: kebab-case (`themed-view.tsx`, `use-color-scheme.ts`)
- **Components**: PascalCase exports (`ThemedView`, `HapticTab`)
- **Hooks**: camelCase with `use` prefix (`useThemeColor`)

### Imports

Use the `@/` path alias for absolute imports:

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

// Direct color access
const backgroundColor = useThemeColor({}, 'background');
```

### Platform-Specific Code

Use `.ios.tsx` / `.android.tsx` / `.web.tsx` suffixes for platform variants.

## Documentation

- [Design Document](docs/DESIGN.md) — Problem, users, scope, and data model
- [Workplan](docs/WORKPLAN.md) — Implementation phases and milestones

## License

Private
