/**
 * Whale Watch — useWhaleEvents Hook
 *
 * Fetches paginated whale transactions from GET /api/whale/events.
 * Respects chain, direction, wallet_type filters and page state.
 *
 * Cache: staleTime 60s (BRD §9), gcTime 5min, 2 retries.
 */

import { useQuery } from '@tanstack/react-query';
import type { WhaleEventsFilter, WhaleEventsResponse } from '../types';

function getAuthHeaders(): Record<string, string> {
    const sessionId = localStorage.getItem('sessionId');
    return sessionId ? { Authorization: `Bearer ${sessionId}` } : {};
}

function buildQueryString(filter: WhaleEventsFilter): string {
    const params = new URLSearchParams();
    if (filter.chain) params.set('chain', filter.chain);
    if (filter.direction) params.set('direction', filter.direction);
    if (filter.walletType) params.set('wallet_type', filter.walletType);
    if (filter.page && filter.page > 1) params.set('page', String(filter.page));
    if (filter.pageSize) params.set('page_size', String(filter.pageSize));
    const qs = params.toString();
    return qs ? `?${qs}` : '';
}

export function useWhaleEvents(filter: WhaleEventsFilter = {}) {
    return useQuery<WhaleEventsResponse, Error>({
        queryKey: ['/api/whale/events', filter],
        queryFn: async () => {
            const qs = buildQueryString(filter);
            const res = await fetch(`/api/whale/events${qs}`, {
                headers: getAuthHeaders(),
                credentials: 'include',
            });

            if (res.status === 403) {
                throw new Error('TIER_RESTRICTED');
            }
            if (!res.ok) {
                const text = await res.text().catch(() => res.statusText);
                throw new Error(`${res.status}: ${text}`);
            }

            return res.json();
        },
        staleTime: 15 * 60 * 1000, // 15 minutes (Middle ground)
        gcTime: 4 * 60 * 60 * 1000, // 4 hours
        retry: 2,
        refetchOnWindowFocus: false,
    });
}
