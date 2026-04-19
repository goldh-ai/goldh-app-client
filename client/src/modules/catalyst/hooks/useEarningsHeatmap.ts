import { useQuery } from '@tanstack/react-query';
import { apiUrl } from '@/lib/queryClient';

export interface EarningsHeatmapRow {
    week_start: string;
    sector: string;
    earnings_count: number;
    avg_impact_score: number | null;
    heatmap_intensity: 1 | 2 | 3;
    event_ids: string[];
}

interface EarningsHeatmapResponse {
    heatmap: EarningsHeatmapRow[];
    count: number;
}

export function useEarningsHeatmap() {
    return useQuery<EarningsHeatmapResponse>({
        queryKey: ['/api/catalyst/earnings_heatmap'],
        queryFn: async () => {
            const sessionId = localStorage.getItem('sessionId');
            const headers: Record<string, string> = sessionId ? { Authorization: `Bearer ${sessionId}` } : {};
            const res = await fetch(apiUrl('/api/catalyst/earnings_heatmap'), { headers, credentials: 'include' });
            if (!res.ok) throw new Error(`Failed to fetch earnings heatmap: ${res.status}`);
            return res.json();
        },
        staleTime: 60 * 60 * 1000,
        refetchInterval: 60 * 60 * 1000,
    });
}
