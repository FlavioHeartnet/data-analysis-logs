# ObservaSync — Work Plan

## Overview

**Goal**: Build a mobile+web observability aggregator that shows Grafana alerts + GitHub commits in a correlated feed.  
**Timeline**: 4 weeks  
**Stack**: Expo (frontend) + NestJS (backend) + PostgreSQL

---

## Phase 1: Foundation (Week 1)

### 1.1 Project Setup
- [ ] Initialize NestJS backend with TypeScript
- [ ] Set up PostgreSQL database (local Docker for dev)
- [ ] Configure TypeORM or Prisma for migrations
- [ ] Set up basic auth module (email/password)
- [ ] Create user and integration entities
- [ ] Initialize Expo project (already done — this repo)
- [ ] Set up path aliases and theme system (already done)

### 1.2 Integration Framework
- [ ] Create integration module with CRUD for API credentials
- [ ] Implement secure credential storage (encryption at rest)
- [ ] Build Grafana API client service
- [ ] Build GitHub API client service
- [ ] Create sync job scheduler (cron for polling)

### 1.3 Data Model
- [ ] Design event schema (JSONB for flexible payload)
- [ ] Create events table with indexes (user_id, timestamp, type)
- [ ] Create sync_state table for tracking last sync
- [ ] Write migrations

**Deliverable**: Backend boots, can store users and integrations, API clients can authenticate with Grafana/GitHub.

---

## Phase 2: Data Pipeline (Week 2)

### 2.1 Grafana Sync
- [ ] Fetch alerts from Grafana Alerting API
- [ ] Fetch key metrics (error rate, latency) from Prometheus via Grafana
- [ ] Normalize alert data to event schema
- [ ] Implement incremental sync (only fetch new since last_synced_at)
- [ ] Handle rate limits and errors gracefully

### 2.2 GitHub Sync
- [ ] Fetch releases/tags matching semver pattern
- [ ] Fetch commits between releases
- [ ] Extract deploy timestamps from tags
- [ ] Normalize to event schema

### 2.3 Correlation Engine
- [ ] Implement time-window correlation (alert → commits within ±2 hours)
- [ ] Store correlations as event relationships
- [ ] API endpoint: GET /events with correlations populated

### 2.4 Backend API
- [ ] GET /events (paginated feed, filterable by type/date)
- [ ] GET /events/:id (single event with correlations)
- [ ] GET /metrics/summary (current error rate, latency, usage)
- [ ] GET /sync/status (last synced times per integration)

**Deliverable**: Backend fetches real data from Grafana/GitHub, correlates events, exposes REST API.

---

## Phase 3: Mobile UI (Week 3)

### 3.1 Navigation & Auth
- [ ] Add auth screens (login, register) using expo-screen skill
- [ ] Implement secure token storage (expo-secure-store)
- [ ] Add settings screen for API key input
- [ ] Protected routes (redirect to login if no token)

### 3.2 Dashboard Components
- [ ] Create `metric-card` component (big number + trend)
- [ ] Create `event-card` component (alert/deploy with timestamp)
- [ ] Create `timeline-feed` component (scrollable list)
- [ ] Create `correlation-list` component (commits linked to event)
- [ ] Build using expo-component skill patterns

### 3.3 Main Screens
- [ ] **Feed screen**: Summary widgets + event timeline
- [ ] **Event detail screen**: Full event + correlated commits
- [ ] **Settings screen**: Integration management

### 3.4 Data Fetching
- [ ] Set up API client with axios
- [ ] Add React Query for caching and refetch
- [ ] Implement pull-to-refresh
- [ ] Show "Last synced X ago" indicator
- [ ] Handle offline/error states gracefully

**Deliverable**: Working mobile app showing real feed data with correlations.

---

## Phase 4: Polish & Web (Week 4)

### 4.1 Design Polish
- [ ] Implement Apple Health-style aesthetic
- [ ] Add charts for metrics (victory-native or react-native-svg-charts)
- [ ] Dark mode support (already have theme system)
- [ ] Loading skeletons
- [ ] Empty states
- [ ] Error states with retry

### 4.2 Web Support
- [ ] Test all screens on web (Expo web)
- [ ] Fix any web-specific layout issues
- [ ] Ensure responsive design for larger screens

### 4.3 Performance
- [ ] Optimize feed rendering (FlashList or virtualized list)
- [ ] Add image/avatar caching
- [ ] Minimize API calls with smart caching

### 4.4 Testing & Docs
- [ ] Manual testing on iOS, Android, Web
- [ ] Document setup process in README
- [ ] Document API endpoints
- [ ] Create demo account with sample data

**Deliverable**: Polished v1 ready for daily use.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Mobile App (Expo)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │   Feed   │  │  Detail  │  │ Settings │  │   Auth   │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│       └─────────────┴─────────────┴─────────────┘          │
│                           │                                  │
│                    React Query + Axios                       │
└───────────────────────────┬─────────────────────────────────┘
                            │ REST API
┌───────────────────────────┴─────────────────────────────────┐
│                     Backend (NestJS)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │   Auth   │  │  Events  │  │   Sync   │  │ Metrics  │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│       └─────────────┴─────────────┴─────────────┘          │
│                           │                                  │
│              ┌────────────┼────────────┐                    │
│              ▼            ▼            ▼                    │
│         PostgreSQL    Grafana API  GitHub API               │
└─────────────────────────────────────────────────────────────┘
```

---

## File Structure (Frontend)

```
app/
├── _layout.tsx              # Root layout with auth check
├── (auth)/
│   ├── _layout.tsx
│   ├── login.tsx
│   └── register.tsx
├── (tabs)/
│   ├── _layout.tsx
│   ├── index.tsx            # Feed screen
│   ├── settings.tsx         # Settings screen
│   └── explore.tsx          # (remove or repurpose)
├── event/
│   └── [id].tsx             # Event detail screen
└── modal.tsx                # (keep for modals)

components/
├── metric-card.tsx
├── event-card.tsx
├── timeline-feed.tsx
├── correlation-list.tsx
├── sync-status.tsx
└── ui/
    ├── chart.tsx
    ├── skeleton.tsx
    └── error-boundary.tsx

hooks/
├── use-events.ts            # React Query hook for events
├── use-metrics.ts           # React Query hook for metrics
├── use-auth.ts              # Auth state management
└── use-sync-status.ts

services/
├── api.ts                   # Axios instance
├── auth.ts                  # Auth API calls
└── events.ts                # Events API calls
```

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Grafana API complexity | Start with alerts only, add metrics incrementally |
| GitHub rate limits | Implement caching, use conditional requests (ETags) |
| Correlation accuracy | Start with simple time-window, iterate based on feedback |
| Scope creep | Stick to pure viewer — no write actions |
| Timeline pressure | Cut charts/polish if behind, core feed is priority |

---

## Definition of Done (v1)

- [ ] User can sign up and log in
- [ ] User can add Grafana and GitHub API keys
- [ ] Feed shows alerts from Grafana
- [ ] Feed shows usage metrics
- [ ] Tapping alert shows correlated commits
- [ ] Works on iOS, Android, and Web
- [ ] Handles offline/error gracefully
- [ ] Looks clean and professional (not default styles)
