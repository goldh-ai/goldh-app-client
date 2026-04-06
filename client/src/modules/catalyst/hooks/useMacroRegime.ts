import { useQuery } from '@tanstack/react-query';

export interface MacroRegimeData {
    inflation_regime: 'Rising' | 'Cooling' | 'Persistent';
    liquidity_regime: 'Expanding' | 'Neutral' | 'Tightening';
    risk_regime: 'Risk-On' | 'Neutral' | 'Risk-Off';
    detected_at: string;
    changed_at: string | null;
    previous_inflation_regime: string | null;
    previous_liquidity_regime: string | null;
    previous_risk_regime: string | null;
    contributing_event_ids: string[];
}

export function useMacroRegime() {
    return useQuery<MacroRegimeData>({
        queryKey: ['/api/catalyst/macro_regime'],
        queryFn: async () => {
            const sessionId = localStorage.getItem('sessionId');
            const headers: Record<string, string> = sessionId ? { Authorization: `Bearer ${sessionId}` } : {};
            const res = await fetch('/api/catalyst/macro_regime', { headers, credentials: 'include' });
            if (res.status === 404) return null as any;
            if (!res.ok) throw new Error(`Failed to fetch macro regime: ${res.status}`);
            return res.json();
        },
        staleTime: 10 * 60 * 1000,
        refetchInterval: 10 * 60 * 1000,
    });
}
