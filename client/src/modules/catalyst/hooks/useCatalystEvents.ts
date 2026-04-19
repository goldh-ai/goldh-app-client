/**
 * Catalyst Intelligence Engine — Data Fetching Hook
 *
 * TanStack Query hook for fetching catalyst events from GET /api/events.
 * Supports filtering by type, name, bucket, ticker, and upcoming flag.
 */

import { useQuery } from '@tanstack/react-query';
import { apiUrl } from '@/lib/queryClient';
import type { CatalystEvent } from '../types';

interface CatalystFilters {
    type?: 'macro' | 'earnings' | 'all';
    name?: string;
    bucket?: 0 | 40 | 80;
    ticker?: string;
    upcoming?: boolean;
}

interface CatalystEventsResponse {
    events: CatalystEvent[];
    count: number;
    tier?: string;
    full_access?: boolean;
    earnings_restricted?: boolean;
}

function buildQueryString(filters?: CatalystFilters): string {
    if (!filters) return '';
    const params = new URLSearchParams();
    if (filters.type && filters.type !== 'all') params.set('type', filters.type);
    if (filters.name) params.set('name', filters.name);
    if (filters.bucket != null) params.set('bucket', String(filters.bucket));
    if (filters.ticker) params.set('ticker', filters.ticker);
    if (filters.upcoming) params.set('upcoming', 'true');
    const qs = params.toString();
    return qs ? `?${qs}` : '';
}

export function useCatalystEvents(filters?: CatalystFilters) {
    const qs = buildQueryString(filters);
    return useQuery<CatalystEventsResponse>({
        queryKey: ['/api/catalyst/feed', filters],
        queryFn: async () => {
            const sessionId = localStorage.getItem('sessionId');
            const headers: Record<string, string> = sessionId ? { Authorization: `Bearer ${sessionId}` } : {};
            const res = await fetch(apiUrl(`/api/catalyst/feed${qs}`), { headers, credentials: 'include' });
            if (!res.ok) {
                throw new Error(`Failed to fetch catalyst events: ${res.status}`);
            }
            return res.json();
        },
        staleTime: 5 * 60 * 1000,       // 5 min — events don't change often
        refetchInterval: 5 * 60 * 1000, // Poll every 5 min
    });
}
