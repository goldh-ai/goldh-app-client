/**
 * Pulse v2 QA Mock Data
 *
 * Fixtures for tier enforcement, confidence badge rendering, movement context,
 * and degraded state tests. All 7 asset classes populated.
 */

import type { PulseOverviewResponse, PulseAssetDetailResponse, PulseAsset } from '../types';

const NOW = '2026-03-01T10:00:00.000Z';

/** Base asset factory */
function makeAsset(overrides: Partial<PulseAsset> & Pick<PulseAsset, 'symbol' | 'name' | 'assetClass'>): PulseAsset {
  return {
    price: 1000,
    percentChange24h: 1.5,
    volume24h: 50_000_000,
    lastUpdated: NOW,
    confidenceScore: 85,
    confidenceBadge: 'green',
    ...overrides,
  };
}

// ─── Crypto assets ────────────────────────────────────────────────────────────
const BTC = makeAsset({ symbol: 'BTC', name: 'Bitcoin', assetClass: 'crypto', price: 94000, percentChange24h: 5.2, volume24h: 28_000_000_000, confidenceScore: 92, confidenceBadge: 'green' });
const ETH = makeAsset({ symbol: 'ETH', name: 'Ethereum', assetClass: 'crypto', price: 3100, percentChange24h: -1.1, volume24h: 14_000_000_000, confidenceScore: 55, confidenceBadge: 'amber' });
const SOL = makeAsset({ symbol: 'SOL', name: 'Solana', assetClass: 'crypto', price: 155, percentChange24h: 0, volume24h: null, confidenceScore: 40, confidenceBadge: 'red' });

// ─── Equities ─────────────────────────────────────────────────────────────────
const AAPL = makeAsset({ symbol: 'AAPL', name: 'Apple Inc.', assetClass: 'equity', price: 189.5, percentChange24h: 0.8, volume24h: 55_000_000 });
const MSFT = makeAsset({ symbol: 'MSFT', name: 'Microsoft Corp.', assetClass: 'equity', price: 415, percentChange24h: -0.3, volume24h: 22_000_000 });
const NVDA = makeAsset({ symbol: 'NVDA', name: 'NVIDIA Corp.', assetClass: 'equity', price: 875, percentChange24h: 3.5, volume24h: 48_000_000 });

// ─── Indices ──────────────────────────────────────────────────────────────────
const SPX = makeAsset({ symbol: 'SPX', name: 'S&P 500', assetClass: 'index', price: 5123.41, percentChange24h: 0.4 });
const NDX = makeAsset({ symbol: 'NDX', name: 'Nasdaq 100', assetClass: 'index', price: 17892.3, percentChange24h: 0.6 });

// ─── Commodities ──────────────────────────────────────────────────────────────
const GOLD = makeAsset({ symbol: 'GC', name: 'Gold', assetClass: 'commodity', price: 2980.5, percentChange24h: 0.2 });
const OIL = makeAsset({ symbol: 'CL', name: 'Crude Oil', assetClass: 'commodity', price: 72.3, percentChange24h: -1.8 });

// ─── Bonds ────────────────────────────────────────────────────────────────────
const US10Y = makeAsset({ symbol: 'US10Y', name: 'US 10Y Treasury', assetClass: 'bond', price: 4.25, percentChange24h: 0.05, volume24h: null });

// ─── ETFs ─────────────────────────────────────────────────────────────────────
const SPY = makeAsset({ symbol: 'SPY', name: 'SPDR S&P 500 ETF', assetClass: 'etf', price: 512.8, percentChange24h: 0.4 });
const QQQ = makeAsset({ symbol: 'QQQ', name: 'Invesco QQQ Trust', assetClass: 'etf', price: 447.5, percentChange24h: 0.7 });

// ─── FX ───────────────────────────────────────────────────────────────────────
const EURUSD = makeAsset({ symbol: 'EURUSD', name: 'Euro / US Dollar', assetClass: 'fx', price: 1.0842, percentChange24h: 0.15 });
const USDJPY = makeAsset({ symbol: 'USDJPY', name: 'US Dollar / Yen', assetClass: 'fx', price: 149.32, percentChange24h: -0.2 });

// ─── Overview Responses ───────────────────────────────────────────────────────

/** Free-tier overview — price = previousClose, changes null */
export const MOCK_OVERVIEW_FREE: PulseOverviewResponse = {
  timestamp_utc: NOW,
  tier: 'free',
  degraded: false,
  assetGroups: {
    crypto: [
      { ...BTC, percentChange24h: null, volume24h: null, price: 91500 },
      { ...ETH, percentChange24h: null, volume24h: null, price: 3050 },
      { ...SOL, percentChange24h: null, volume24h: null, price: 151 },
    ],
    equity: [
      { ...AAPL, percentChange24h: null, volume24h: null },
      { ...MSFT, percentChange24h: null, volume24h: null },
      { ...NVDA, percentChange24h: null, volume24h: null },
    ],
    index: [{ ...SPX, percentChange24h: null, volume24h: null }, { ...NDX, percentChange24h: null, volume24h: null }],
    commodity: [{ ...GOLD, percentChange24h: null, volume24h: null }, { ...OIL, percentChange24h: null, volume24h: null }],
    bond: [{ ...US10Y, percentChange24h: null, volume24h: null }],
    etf: [{ ...SPY, percentChange24h: null, volume24h: null }, { ...QQQ, percentChange24h: null, volume24h: null }],
    fx: [{ ...EURUSD, percentChange24h: null, volume24h: null }, { ...USDJPY, percentChange24h: null, volume24h: null }],
  },
};

/** Essential-tier overview — full live data */
export const MOCK_OVERVIEW_ESSENTIALS: PulseOverviewResponse = {
  timestamp_utc: NOW,
  tier: 'essential',
  degraded: false,
  assetGroups: {
    crypto: [BTC, ETH, SOL],  // ≥1 positive, ≥1 negative, ≥1 neutral for color test
    equity: [AAPL, MSFT, NVDA],
    index: [SPX, NDX],
    commodity: [GOLD, OIL],
    bond: [US10Y],
    etf: [SPY, QQQ],
    fx: [EURUSD, USDJPY],
  },
};

/** Degraded state — same as essentials but degraded: true, mixed confidence */
export const MOCK_OVERVIEW_DEGRADED: PulseOverviewResponse = {
  ...MOCK_OVERVIEW_ESSENTIALS,
  degraded: true,
  assetGroups: {
    ...MOCK_OVERVIEW_ESSENTIALS.assetGroups,
    // Mix confidence levels to test row-level rendering in degraded state
    crypto: [
      BTC,                          // green confidence, healthy provider
      { ...ETH, confidenceBadge: 'red', confidenceScore: 15 },   // red — stale
    ],
  },
};

/** Admin/Pro tier — same live data as essential (currently same access level) */
export const MOCK_OVERVIEW_PRO: PulseOverviewResponse = {
  ...MOCK_OVERVIEW_ESSENTIALS,
  tier: 'pro',
};

// ─── Asset Detail Responses ───────────────────────────────────────────────────

/** Asset moving ≥3% — should trigger movement explanation */
export const MOCK_ASSET_MOVING: PulseAssetDetailResponse = {
  asset: BTC,
  movementContext: {
    explanation: 'BTC moved 5.20% up in 24h amid elevated trading activity.',
  },
};

/** Asset flat <3% — no significant movement */
export const MOCK_ASSET_FLAT: PulseAssetDetailResponse = {
  asset: ETH,
  movementContext: {
    explanation: 'No significant movement detected.',
  },
};

/** Free-tier asset detail — live fields masked */
export const MOCK_ASSET_FREE: PulseAssetDetailResponse = {
  asset: { ...BTC, percentChange24h: null, volume24h: null, price: 91500 },
  movementContext: {
    explanation: 'No significant movement detected.',
  },
};
