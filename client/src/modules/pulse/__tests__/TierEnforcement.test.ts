/**
 * Tier Enforcement — pure logic tests
 *
 * Validates the tier masking rules using the mock data fixtures.
 * Does not require React or DOM — tests the data contracts only.
 */

import { describe, it, expect } from 'vitest';
import {
  MOCK_OVERVIEW_FREE,
  MOCK_OVERVIEW_ESSENTIALS,
  MOCK_OVERVIEW_PRO,
  MOCK_ASSET_FREE,
  MOCK_ASSET_MOVING,
  MOCK_ASSET_FLAT,
  MOCK_OVERVIEW_DEGRADED,
} from './mockData';
import { PULSE_ASSET_CLASSES } from '../types';

// ─── Tier masking ─────────────────────────────────────────────────────────────

describe('Free tier: data masking', () => {
  it('returns tier: free', () => {
    expect(MOCK_OVERVIEW_FREE.tier).toBe('free');
  });

  it('masks percentChange24h to null for all crypto assets', () => {
    for (const asset of MOCK_OVERVIEW_FREE.assetGroups.crypto ?? []) {
      expect(asset.percentChange24h).toBeNull();
    }
  });

  it('masks volume24h to null for all crypto assets', () => {
    for (const asset of MOCK_OVERVIEW_FREE.assetGroups.crypto ?? []) {
      expect(asset.volume24h).toBeNull();
    }
  });

  it('returns a non-null price (previousClose) for free-tier crypto', () => {
    for (const asset of MOCK_OVERVIEW_FREE.assetGroups.crypto ?? []) {
      expect(asset.price).not.toBeNull();
      expect(typeof asset.price).toBe('number');
    }
  });

  it('free-tier asset detail shows null percentChange24h', () => {
    expect(MOCK_ASSET_FREE.asset.percentChange24h).toBeNull();
  });

  it('free-tier asset detail still has price from previousClose', () => {
    expect(MOCK_ASSET_FREE.asset.price).not.toBeNull();
  });

  it('free-tier movement context shows no significant movement (change masked)', () => {
    expect(MOCK_ASSET_FREE.movementContext?.explanation).toBe('No significant movement detected.');
  });
});

describe('Essential tier: full live data', () => {
  it('returns tier: essential', () => {
    expect(MOCK_OVERVIEW_ESSENTIALS.tier).toBe('essential');
  });

  it('exposes percentChange24h for crypto assets', () => {
    const crypto = MOCK_OVERVIEW_ESSENTIALS.assetGroups.crypto ?? [];
    const withChange = crypto.filter((a) => a.percentChange24h !== null);
    expect(withChange.length).toBeGreaterThan(0);
  });

  it('exposes volume24h for assets that have it', () => {
    const crypto = MOCK_OVERVIEW_ESSENTIALS.assetGroups.crypto ?? [];
    const withVolume = crypto.filter((a) => a.volume24h !== null);
    expect(withVolume.length).toBeGreaterThan(0);
  });

  it('has at least one positive, one negative, one zero/null % change (for color test coverage)', () => {
    const crypto = MOCK_OVERVIEW_ESSENTIALS.assetGroups.crypto ?? [];
    const positive = crypto.some((a) => (a.percentChange24h ?? 0) > 0);
    const negative = crypto.some((a) => (a.percentChange24h ?? 0) < 0);
    const neutral = crypto.some((a) => a.percentChange24h === 0 || a.percentChange24h === null);
    expect(positive).toBe(true);
    expect(negative).toBe(true);
    expect(neutral).toBe(true);
  });
});

describe('Pro/Elite tier: same live access as Essential', () => {
  it('pro tier response has full live data', () => {
    const crypto = MOCK_OVERVIEW_PRO.assetGroups.crypto ?? [];
    expect(crypto.some((a) => a.percentChange24h !== null)).toBe(true);
  });
});

// ─── Field exclusion compliance ────────────────────────────────────────────────

describe('BRD field compliance: excluded fields must not appear', () => {
  it('no marketCap field in any asset (essentials)', () => {
    for (const cls of PULSE_ASSET_CLASSES) {
      for (const asset of MOCK_OVERVIEW_ESSENTIALS.assetGroups[cls] ?? []) {
        expect((asset as any).marketCap).toBeUndefined();
      }
    }
  });

  it('no dayHigh field in any asset', () => {
    for (const cls of PULSE_ASSET_CLASSES) {
      for (const asset of MOCK_OVERVIEW_ESSENTIALS.assetGroups[cls] ?? []) {
        expect((asset as any).dayHigh).toBeUndefined();
      }
    }
  });

  it('no sevenDayChange field in any asset', () => {
    for (const cls of PULSE_ASSET_CLASSES) {
      for (const asset of MOCK_OVERVIEW_ESSENTIALS.assetGroups[cls] ?? []) {
        expect((asset as any).sevenDayChange).toBeUndefined();
      }
    }
  });

  it('no providerUsed field in any public asset', () => {
    for (const asset of MOCK_OVERVIEW_ESSENTIALS.assetGroups.crypto ?? []) {
      expect((asset as any).providerUsed).toBeUndefined();
    }
  });
});

// ─── Asset class tabs ─────────────────────────────────────────────────────────

describe('Asset class grouping: all 7 classes present', () => {
  it('overview contains all 7 asset class groups', () => {
    for (const cls of PULSE_ASSET_CLASSES) {
      expect(MOCK_OVERVIEW_ESSENTIALS.assetGroups[cls]).toBeDefined();
      expect(Array.isArray(MOCK_OVERVIEW_ESSENTIALS.assetGroups[cls])).toBe(true);
    }
  });

  it('each asset is placed in the correct group', () => {
    for (const cls of PULSE_ASSET_CLASSES) {
      for (const asset of MOCK_OVERVIEW_ESSENTIALS.assetGroups[cls] ?? []) {
        expect(asset.assetClass).toBe(cls);
      }
    }
  });
});

// ─── Movement context ─────────────────────────────────────────────────────────

describe('Movement context: ±3% threshold', () => {
  it('generates explanation when |change| >= 3%', () => {
    const explanation = MOCK_ASSET_MOVING.movementContext?.explanation ?? '';
    expect(explanation).not.toBe('No significant movement detected.');
    expect(explanation).toContain('BTC');
    expect(explanation).toContain('5.20%');
  });

  it('returns no significant movement when |change| < 3%', () => {
    expect(MOCK_ASSET_FLAT.movementContext?.explanation).toBe('No significant movement detected.');
  });

  it('direction is "up" for positive change', () => {
    const explanation = MOCK_ASSET_MOVING.movementContext?.explanation ?? '';
    expect(explanation).toContain('up');
  });
});

// ─── Degraded state ───────────────────────────────────────────────────────────

describe('Degraded state', () => {
  it('degraded: true when snapshot is degraded', () => {
    expect(MOCK_OVERVIEW_DEGRADED.degraded).toBe(true);
  });

  it('degraded response still includes assets', () => {
    expect(MOCK_OVERVIEW_DEGRADED.assetGroups.crypto?.length).toBeGreaterThan(0);
  });

  it('degraded response can have mixed confidence levels (some green, some red)', () => {
    const crypto = MOCK_OVERVIEW_DEGRADED.assetGroups.crypto ?? [];
    const green = crypto.some((a) => a.confidenceBadge === 'green');
    const red = crypto.some((a) => a.confidenceBadge === 'red');
    expect(green).toBe(true);
    expect(red).toBe(true);
  });
});

// ─── Confidence badge values ──────────────────────────────────────────────────

describe('Confidence badge values', () => {
  it('confidenceBadge is one of green | amber | red', () => {
    const valid = ['green', 'amber', 'red'];
    for (const asset of MOCK_OVERVIEW_ESSENTIALS.assetGroups.crypto ?? []) {
      expect(valid).toContain(asset.confidenceBadge);
    }
  });

  it('confidenceScore is between 0 and 100', () => {
    for (const asset of MOCK_OVERVIEW_ESSENTIALS.assetGroups.crypto ?? []) {
      expect(asset.confidenceScore).toBeGreaterThanOrEqual(0);
      expect(asset.confidenceScore).toBeLessThanOrEqual(100);
    }
  });
});
