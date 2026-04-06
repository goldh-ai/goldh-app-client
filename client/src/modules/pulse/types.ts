/**
 * Pulse v2 Client Types — BRD v2.1 Compliant
 *
 * Only fields listed in BRD are present. Do NOT add marketCap, dayHigh, dayLow, or sevenDayChange.
 */

/** BRD-allowed asset display fields + metadata for grouping. */
export interface PulseAsset {
  symbol: string;
  name: string;
  /** Used for tab grouping — not displayed in table rows. */
  assetClass: string;
  /** null for free-tier users (delayed data served as previousClose) */
  price: number | null;
  /** null for free-tier users */
  percentChange24h: number | null;
  /** null for free-tier users */
  volume24h: number | null;
  lastUpdated: string;
  confidenceScore: number;
  confidenceBadge: 'green' | 'amber' | 'red';
  /**
   * 7-day price history data points for sparkline rendering.
   * Stage 3B: populated from EOD snapshots. Stage 3A: client-derived mock.
   */
  sparkline7d?: number[];
  /**
   * 7-day percentage change. Stage 3B: served from API.
   * Stage 3A: null (shown as —).
   */
  sevenDayChange?: number | null;
}

/** Alert evaluation result returned from GET /api/pulse/overview?evaluate=true */
export interface AlertEvaluationResult {
  alertId: string;
  symbol: string;
  alertType: 'price_threshold' | 'pct_change' | 'volume_spike' | 'intraday_break';
  triggered: boolean;
  currentValue: number | null;
  threshold: number | null;
  direction: 'above' | 'below' | null;
}

/** Response shape from GET /api/pulse/overview */
export interface PulseOverviewResponse {
  timestamp_utc: string;
  assetGroups: Record<string, PulseAsset[]>;
  degraded?: boolean;
  /** Tier of the requesting user — set server-side. Client never overrides tier logic. */
  tier: string;
  /** Populated when ?evaluate=true is passed. Only includes triggered alerts. */
  triggeredAlerts?: AlertEvaluationResult[];
}

/** Response shape from GET /api/pulse/asset/:symbol */
export interface PulseAssetDetailResponse {
  asset: PulseAsset;
  movementContext?: { explanation: string };
}

/** Extended overview with UI metadata from the hook */
export interface PulseOverviewExtended {
  data: PulseOverviewResponse;
  degraded: boolean;
  tier: string;
  sourceUi: 'Live' | 'Firestore' | 'Empty';
  triggeredAlerts: AlertEvaluationResult[];
}

/** Asset classes supported in the v2 dashboard (all 7 classes as separate tabs) */
export const PULSE_ASSET_CLASSES = ['crypto', 'equity', 'index', 'commodity', 'bond', 'etf', 'fx'] as const;
export type PulseAssetClass = typeof PULSE_ASSET_CLASSES[number];

/** Column sort keys for the asset table */
export type SortKey = 'symbol' | 'price' | 'percentChange24h' | 'volume24h';
export type SortDir = 'asc' | 'desc';

/** Display labels for each asset class tab */
export const ASSET_CLASS_LABELS: Record<PulseAssetClass, string> = {
  crypto: 'Crypto',
  equity: 'Equities',
  index: 'Indices',
  commodity: 'Commodities',
  bond: 'Bonds',
  etf: 'ETFs',
  fx: 'FX',
};
