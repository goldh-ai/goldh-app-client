/**
 * Whale Watch — useWhaleNetflow Hook
 *
 * Fetches net flow metrics for a single chain from GET /api/whale/netflow.
 * Used both by the Whale Watch hero and the Pulse cross-module badge.
 *
 * Cache: staleTime 300s (BRD §9 — netflow_{chain} TTL).
 */

import { useQuery } from '@tanstack/react-query';
import type { NetFlowResponse } from '../types';

function getAuthHeaders(): Record<string, string> {
    const sessionId = localStorage.getItem('sessionId');
    return sessionId ? { Authorization: `Bearer ${sessionId}` } : {};
}

export function useWhaleNetflow(chain: 'BTC' | 'ETH' = 'BTC', options?: { enabled?: boolean }) {
    return useQuery<NetFlowResponse, Error>({
        queryKey: ['/api/whale/netflow', chain],
        enabled: options?.enabled !== false,
        queryFn: async () => {
            const res = await fetch(`/api/whale/netflow?chain=${chain}`, {
                headers: getAuthHeaders(),
                credentials: 'include',
            });

            if (res.status === 403) throw new Error('TIER_RESTRICTED');
            if (res.status === 503) throw new Error('NO_DATA');
            if (!res.ok) {
                const text = await res.text().catch(() => res.statusText);
                throw new Error(`${res.status}: ${text}`);
            }

            return res.json();
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: (failureCount, error) => error.message !== 'TIER_RESTRICTED' && failureCount < 1,
    });
}
