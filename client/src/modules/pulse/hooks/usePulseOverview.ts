/**
 * Pulse v2 TanStack Query Hooks
 *
 * Hooks:
 *   usePulseOverview()        — Full overview with all asset classes grouped
 *   usePulseAsset(symbol)     — Single asset detail with movement context
 */

import { useQuery } from '@tanstack/react-query';
import type { PulseOverviewExtended, PulseAssetDetailResponse, AlertEvaluationResult } from '../types';

function getAuthHeaders(): Record<string, string> {
  const sessionId = localStorage.getItem('sessionId');
  return sessionId ? { Authorization: `Bearer ${sessionId}` } : {};
}

function mapSourceHeader(header: string | null): 'Live' | 'Firestore' | 'Empty' {
  if (header === 'cache') return 'Live';
  if (header === 'firestore') return 'Firestore';
  return 'Empty';
}

// ─── usePulseOverview ─────────────────────────────────────────────────────────

/**
 * Fetches the Pulse v2 overview from GET /api/pulse/overview.
 *
 * Returns assets grouped by all 7 asset classes, tier info, and degraded state.
 * Tier masking is applied server-side — client never adjusts data based on tier.
 *
 * Cache: staleTime 30s, gcTime 5min, 2 retries.
 */
export function usePulseOverview() {
  return useQuery<PulseOverviewExtended, Error>({
    queryKey: ['/api/pulse/overview', 'evaluate'],
    queryFn: async () => {
      const response = await fetch('/api/pulse/overview?evaluate=true', {
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const text = await response.text().catch(() => response.statusText);
        throw new Error(`${response.status}: ${text}`);
      }

      const data = await response.json();
      const sourceHeader = response.headers.get('x-pulse-source');

      return {
        data,
        degraded: data.degraded ?? false,
        tier: data.tier ?? 'free',
        sourceUi: mapSourceHeader(sourceHeader),
        triggeredAlerts: (data.triggeredAlerts ?? []) as AlertEvaluationResult[],
      };
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 4 * 60 * 60 * 1000, // 4 hours
    retry: 2,
  });
}

// ─── usePulseAsset ────────────────────────────────────────────────────────────

/**
 * Fetches a single asset detail from GET /api/pulse/asset/:symbol.
 *
 * Includes movement context explanation (template-based, triggered when |change| >= 3%).
 * Only enabled when symbol is a non-empty string.
 */
export function usePulseAsset(symbol: string | undefined) {
  return useQuery<PulseAssetDetailResponse, Error>({
    queryKey: ['/api/pulse/asset', symbol],
    queryFn: async () => {
      const response = await fetch(`/api/pulse/asset/${symbol}`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const text = await response.text().catch(() => response.statusText);
        throw new Error(`${response.status}: ${text}`);
      }

      return response.json();
    },
    enabled: Boolean(symbol),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 4 * 60 * 60 * 1000, // 4 hours
    retry: 2,
  });
}
