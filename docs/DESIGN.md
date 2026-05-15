# ObservaSync — Design Document

## Problem

Engineering managers and tech leads waste significant time **context-switching between 4-5 observability tools** (Grafana, Datadog, CloudWatch, etc.) to get a unified view of system health. When an incident occurs or metrics shift, they can't quickly answer "what changed?" without manually cross-referencing alerts with recent deploys across multiple dashboards.

**Current workaround**: Open Grafana, check alerts, then switch to GitHub, scroll through recent releases, mentally map timestamps, switch back. Repeat for each incident.

**What changed**: Teams now deploy multiple times per day with CI/CD. The volume of events makes manual correlation impractical.

## Users

**Primary**: Engineering managers and tech leads who need an executive-level view of system health without diving into operational detail.

**Context**: Checking on the go (mobile), during standups, or getting a quick pulse before/after meetings. Not for deep incident response (on-call engineers use native tools for that).

## Scope

### In v1
- Feed-style timeline showing alerts/anomalies and usage changes
- Grafana integration (alerts, metrics from Prometheus/Loki)
- GitHub integration (commits, releases with semver tags)
- Automatic time-window correlation: anomaly → show commits within ±N hours
- APM metrics display (error rate, latency, throughput)
- Usage metrics display (active users, feature adoption)
- Personal account auth with manual API key setup
- PostgreSQL persistence for historical queries
- Cached data with "last synced" indicator when APIs fail
- Mobile (iOS/Android) + Web via Expo

### Out (explicitly)
- Creating/editing alerts (stays in Grafana)
- Viewing code diffs or PR details (stays in GitHub)
- On-call scheduling and escalations
- Any write actions (acknowledge, resolve, comment)
- Push notifications
- Other providers (Datadog, CloudWatch, Kibana) — v2+
- Team/org-based access — v2+

### Smallest useful version
Feed with Grafana alerts + GitHub commits correlated by time window. Both integrations required — neither alone provides enough value for daily use.

## Core Flows

### Flow 1 — Morning Health Check
1. User opens app
2. Sees feed of last 24h events (alerts, usage changes)
3. Scans big-number summary widgets (error rate, latency, active users)
4. Taps an alert card to see correlated commits
5. Gets context in 30 seconds, closes app

**Success state**: User knows system health without opening Grafana or GitHub.

### Flow 2 — Post-Deploy Check
1. User deploys new version (externally)
2. Opens app 10 minutes later
3. Checks if any new alerts appeared since deploy
4. Sees deploy marker on timeline
5. Confirms no regression

**Success state**: User has confidence the deploy didn't break anything.

### Flow 3 — Investigate Anomaly
1. User sees alert in feed
2. Taps to expand details
3. Sees "Commits in time window" section
4. Identifies likely culprit commit
5. Shares finding with team (screenshot or just knows)

**Success state**: User identifies probable cause without leaving the app.

## Success Criteria

| Criterion | Measurement |
|-----------|-------------|
| Daily usage | Engineering manager opens app at least once per workday |
| Context switching reduced | User reports checking native tools less frequently |
| Time to context | Under 30 seconds from app open to understanding current health |
| Correlation accuracy | 80%+ of anomalies have the actual culprit commit in the suggested list |

## Data Model

### Entities
- **User**: id, email, created_at, settings (JSON)
- **Integration**: id, user_id, type (grafana|github), credentials (encrypted), config (JSON)
- **Event**: id, user_id, type (alert|usage_spike|deploy), source (grafana|github), timestamp, data (JSONB), correlated_events (array)
- **SyncState**: id, integration_id, last_synced_at, status, error

### Relationships
- User → many Integrations
- User → many Events
- Event → many correlated Events (self-referential for commit correlation)

### State
- **Persisted**: Users, integrations, all events (for historical queries)
- **Transient**: Active API connections, in-flight sync jobs

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Mobile/Web | Expo SDK 54 + React Native | Cross-platform from single codebase |
| Backend | NestJS (TypeScript) | User's expertise, structured APIs |
| Database | PostgreSQL + JSONB | Flexible event schema, good for time-range queries |
| API Clients | Grafana API, GitHub REST API | Native integrations |
| Auth | Email/password + API key storage | Simple for v1, no OAuth complexity |

## Constraints

- **Timeline**: 1 month to functional v1
- **Performance**: Feed should load in <2s on mobile
- **Security**: API keys stored encrypted, never exposed to client
- **Reliability**: Graceful degradation when external APIs fail

## Failure Modes

| Failure | Handling |
|---------|----------|
| Grafana API down | Show cached events + "Last synced X ago" banner |
| GitHub API rate limited | Queue requests, show partial data |
| Invalid API key | Clear error message, prompt to re-enter |
| Network offline | Full offline mode with cached data |
| Sync job crashes | Retry with exponential backoff, log for debugging |

## Design Direction

**Aesthetic**: Apple Health / Fitness app style
- Glanceable widgets with big numbers
- Clean charts (line graphs for trends, bars for comparisons)
- Generous whitespace
- Card-based feed
- Dark mode support (follows system)

**Key screens**:
1. **Feed** (home): Timeline of events with summary widgets at top
2. **Event Detail**: Expanded view with correlated commits
3. **Settings**: Integration setup, API keys
