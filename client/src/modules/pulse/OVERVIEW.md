# GOLDH Pulse – Client Module Overview

## Purpose
The Pulse client module delivers FR1–FR6 of the GOLDH Pulse BRD: a unified multi-asset dashboard with real-time market data, confidence-scored data trust layer, morning brief, and an alerts engine.

## Routes

| Route | Component | Auth | Description |
|---|---|---|---|
| `/pulse/overview` | `PulseOverviewPage` | Required | Primary dashboard — all asset classes, tabs, alerts, section manager |
| `/pulse/asset/:symbol` | `PulseOverviewPage` (detail panel) | Required | Opens `PulseAssetDetailPanel` as a right-side overlay |

Both routes are wrapped in `ProtectedRoute` (mode="prompt") in `client/src/App.tsx`.

## Pages

### `PulseOverviewPage.tsx`
Primary dashboard page.
- **Data**: `usePulseOverview()` → `GET /api/pulse/overview`
- **Morning Pulse**: `useMorningBrief()` → `GET /api/pulse/morningbrief` (rendered in `MorningPulseHero`)
- **Section order/visibility**: `useUserPreferences()` (loaded at login, persisted to server)
- **Alerts**: `useAlerts()` + `?evaluate=true` passed to overview query
- **UI state**: selected symbol (URL sync), search query, sort state

## Components

| Component | File | Purpose |
|---|---|---|
| `MorningPulseHero` | `components/MorningPulseHero.tsx` | Expandable daily/weekly brief — headline + top 3 movers + Watch Today chips + whale badge |
| `PulseAssetTable` | `components/PulseAssetTable.tsx` | Sortable, paginated asset table with sparklines and alert bells |
| `PulseAssetDetailPanel` | `components/PulseAssetDetailPanel.tsx` | Right-side slide-out with price, 7d change, Data Trust Layer, movement context |
| `ConfidenceBadge` | `components/ConfidenceBadge.tsx` | Colored badge (green/amber/red) based on confidence score |
| `TierBanner` | `components/TierBanner.tsx` | Alert banner shown to free-tier users with upgrade link |
| `AlertsBell` | `components/AlertsBell.tsx` | Per-asset bell icon showing alert count; opens AlertsManager drawer |
| `AlertsManager` | `components/AlertsManager.tsx` | Drawer for creating/managing/deleting alerts (all 4 types) |

> Legacy: `PulseAssetRow.tsx` — superseded by `AssetRow` inside `PulseAssetTable.tsx`

## Hooks

| Hook | Endpoint | Auth | staleTime | Description |
|---|---|---|---|---|
| `usePulseOverview()` | `GET /api/pulse/overview?evaluate=true` | Yes | 30s | Full dashboard data grouped by asset class; includes triggered alerts |
| `usePulseAsset(symbol)` | `GET /api/pulse/asset/:symbol` | Yes | 30s | Single asset detail + movement context |
| `useMorningBrief()` | `GET /api/pulse/morningbrief` | No | 5min | Daily or weekly brief (headline, summary, topMovers, briefMode, watchToday chips) |
| `useAlerts()` | `GET /api/pulse/alerts` | Yes | 60s | List of user's configured alerts |
| `useCreateAlert(data)` | `POST /api/pulse/alerts` | Yes | — | Create alert (mutation) |
| `useUpdateAlert(id)` | `PUT /api/pulse/alerts/:id` | Yes | — | Toggle/update alert (mutation) |
| `useDeleteAlert(id)` | `DELETE /api/pulse/alerts/:id` | Yes | — | Delete alert (mutation) |

Auth: sessionId from localStorage sent as `Authorization: Bearer {sessionId}` header.

## Types (`types.ts`)

| Type | Description |
|---|---|
| `PulseAsset` | Single asset row — symbol, name, price, percentChange24h, volume24h, sparkline7d, confidenceScore, confidenceBadge |
| `PulseOverviewResponse` | API shape from `/api/pulse/overview` — timestamp_utc, assetGroups, degraded, tier, triggeredAlerts |
| `PulseAssetDetailResponse` | API shape from `/api/pulse/asset/:symbol` — asset, movementContext |
| `MorningBrief` | Morning brief — headline, summary, topMovers, dateFor, generatedAt, briefMode ('daily'/'weekly_recap'), watchToday (WatchTodayEvent[]) |
| `WatchTodayEvent` | Upcoming macro event chip — name, scheduledTime (ISO), bucket (≥80 red / ≥40 amber) |
| `PulseAssetClass` | Union: `'crypto' \| 'equity' \| 'index' \| 'commodity' \| 'bond' \| 'etf' \| 'fx'` |
| `SortKey` | `'price' \| 'percentChange24h' \| 'volume24h'` |

Constants: `PULSE_ASSET_CLASSES` (7-element array), `ASSET_CLASS_LABELS` (display labels).

## Tier Rules

| Feature | Free | Essential+ |
|---|---|---|
| Live price | Previous close (T-1) | Live refresh |
| % Change 24h | null (masked) | Full |
| Volume 24h | null (masked) | Full |
| 7D Sparkline | Shown (EOD prices) | Shown (EOD prices) |
| Alerts | Max 3 | Unlimited |
| Section customisation | No (server-persisted but read-only UI) | Yes |

Tier masking is applied **server-side only**. Client never overrides.

## Alert Types

| Type | Trigger Condition |
|---|---|
| `price_threshold` | Current price crosses user-set value in specified direction (above/below) |
| `pct_change` | `\|percentChange24h\| >= threshold` |
| `volume_spike` | `volume24h >= threshold × 7-day average volume` |
| `intraday_break` | Price crosses previousClose in specified direction |

Alerts are evaluated at page load using in-memory snapshot data (zero Firestore reads during evaluation).

## Data Trust Layer (FR6)

Confidence formula:
```
confidenceScore = (sourceWeight × 60%) + (freshnessScore × 40%)
sourceWeight:   Primary provider = 100 / Fallback = 70
freshnessScore: <5min = 100 / 5–15min = 70 / 15–60min = 40 / >60min = 10
badge:          Green ≥ 80 / Amber 50–79 / Red < 50
```

Applied server-side in `server/routes/pulse.ts`. Displayed per row (table) and in detail panel header.

## Tests (`__tests__/`)

| File | Coverage |
|---|---|
| `ConfidenceBadge.test.ts` | Badge config mapping, aria-labels, CSS class segregation |
| `PulseOverviewPage.test.tsx` | 7 asset class tabs, tier enforcement, sorting, data shapes |
| `TierEnforcement.test.ts` | Free/Essential/Pro masking, BRD field exclusion, movement context, degraded state |
| `mockData.ts` | QA fixtures — 15 assets across all 7 classes, free/essential/degraded response variants |

## Response Headers (parsed by hooks)

| Header | Source | Values | UI Mapping |
|---|---|---|---|
| `x-pulse-source` | `/api/pulse/overview` | `cache` / `firestore` / `empty` | `sourceUi`: 'Live' / 'Firestore' / 'Empty' |
| `x-morning-brief-source` | `/api/pulse/morningbrief` | `cache` / `firestore` / `empty` | Brief freshness badge |

## Key Files Map

```
client/src/modules/pulse/
├── OVERVIEW.md                        ← this file
├── types.ts                           ← all TypeScript interfaces and constants
├── PulseOverviewPage.tsx              ← primary dashboard page
├── hooks/
│   ├── usePulseOverview.ts            ← dashboard data + alert evaluation
│   ├── useMorningBrief.ts             ← daily morning brief
│   └── useAlerts.ts                   ← alert CRUD mutations
├── components/
│   ├── MorningPulseHero.tsx           ← morning brief hero section
│   ├── PulseAssetTable.tsx            ← sortable asset table with sparklines
│   ├── PulseAssetDetailPanel.tsx      ← right-side detail overlay
│   ├── ConfidenceBadge.tsx            ← green/amber/red trust badge
│   ├── TierBanner.tsx                 ← free-tier upgrade prompt
│   ├── AlertsBell.tsx                 ← per-asset alert indicator
│   └── AlertsManager.tsx             ← alert creation/management drawer
└── __tests__/
    ├── ConfidenceBadge.test.ts
    ├── PulseOverviewPage.test.tsx
    ├── TierEnforcement.test.ts
    └── mockData.ts
```
