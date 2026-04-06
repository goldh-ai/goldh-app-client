import { useState } from 'react';
import { ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { useCatalystTriggers, type CatalystTrigger, type CatalystTriggerType } from '../hooks/useCatalystTriggers';

const TRIGGER_LABELS: Record<CatalystTriggerType, string> = {
    CATALYST_HIGH_IMPACT: 'High Impact',
    CATALYST_VOLATILITY_WINDOW: 'Volatility Window',
    CATALYST_EARNINGS_CLUSTER: 'Earnings Cluster',
    CATALYST_POLICY_SHOCK: 'Policy Shock',
    MACRO_REGIME_SHIFT: 'Regime Shift',
};

const TRIGGER_COLORS: Record<CatalystTriggerType, string> = {
    CATALYST_HIGH_IMPACT: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    CATALYST_VOLATILITY_WINDOW: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    CATALYST_EARNINGS_CLUSTER: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    CATALYST_POLICY_SHOCK: 'bg-red-600/20 text-red-300 border-red-600/30',
    MACRO_REGIME_SHIFT: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

function TriggerBadge({ trigger }: { trigger: CatalystTrigger }) {
    const color = TRIGGER_COLORS[trigger.trigger_type];
    const label = TRIGGER_LABELS[trigger.trigger_type];
    const ttl = trigger.ttl_hours_remaining;
    const ttlStr = ttl < 1 ? '<1h' : `${ttl.toFixed(0)}h`;

    const metaLabel = trigger.trigger_type === 'CATALYST_EARNINGS_CLUSTER'
        ? `Week ${trigger.metadata?.week ?? ''} · ${trigger.metadata?.count ?? ''} events`
        : trigger.trigger_type === 'MACRO_REGIME_SHIFT'
        ? String(trigger.metadata?.risk_regime ?? '')
        : trigger.metadata?.event_name as string ?? '';

    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${color}`}>
            <Zap className="w-3 h-3 flex-shrink-0" />
            <span>{label}</span>
            {metaLabel && <span className="opacity-70">· {metaLabel}</span>}
            <span className="ml-auto opacity-60 font-mono">{ttlStr}</span>
        </div>
    );
}

export function TriggersPanel() {
    const [open, setOpen] = useState(false);
    const { data, isLoading } = useCatalystTriggers();

    const triggers = data?.triggers ?? [];
    if (!isLoading && triggers.length === 0) return null;

    return (
        <div className="border border-[#C7AE6A]/20 rounded-lg bg-[#1a1a1a] overflow-hidden">
            <button
                onClick={() => setOpen(v => !v)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-200 hover:bg-white/5 transition-colors"
            >
                <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#C7AE6A]" />
                    Active Triggers
                    {triggers.length > 0 && (
                        <span className="bg-[#C7AE6A]/20 text-[#C7AE6A] text-xs px-1.5 py-0.5 rounded-full">
                            {triggers.length}
                        </span>
                    )}
                </span>
                {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>

            {open && (
                <div className="px-4 pb-3 pt-1 flex flex-col gap-1.5">
                    {isLoading && <p className="text-xs text-gray-500">Loading triggers…</p>}
                    {triggers.map(t => <TriggerBadge key={t.trigger_id} trigger={t} />)}
                </div>
            )}
        </div>
    );
}
