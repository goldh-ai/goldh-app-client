import { useQuery } from '@tanstack/react-query';

export type CatalystTriggerType =
    | 'CATALYST_HIGH_IMPACT'
    | 'CATALYST_VOLATILITY_WINDOW'
    | 'CATALYST_EARNINGS_CLUSTER'
    | 'CATALYST_POLICY_SHOCK'
    | 'MACRO_REGIME_SHIFT';

export interface CatalystTrigger {
    trigger_id: string;
    trigger_type: CatalystTriggerType;
    triggered_at: string;
    expires_at: string;
    ttl_hours_remaining: number;
    event_id: string | null;
    impact_score?: number;
    bias?: string;
    is_active: boolean;
    metadata?: Record<string, unknown>;
}

interface CatalystTriggersResponse {
    triggers: CatalystTrigger[];
    count: number;
}

export function useCatalystTriggers() {
    return useQuery<CatalystTriggersResponse>({
        queryKey: ['/api/catalyst/triggers'],
        queryFn: async () => {
            const sessionId = localStorage.getItem('sessionId');
            const headers: Record<string, string> = sessionId ? { Authorization: `Bearer ${sessionId}` } : {};
            const res = await fetch('/api/catalyst/triggers', { headers, credentials: 'include' });
            if (!res.ok) throw new Error(`Failed to fetch catalyst triggers: ${res.status}`);
            return res.json();
        },
        staleTime: 5 * 60 * 1000,
        refetchInterval: 5 * 60 * 1000,
    });
}
