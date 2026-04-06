/**
 * Dashboard2 — Whale Watch Section
 *
 * Free: TierGate overlay directly.
 * Essential+: BTC net flow summary card with direction, confidence, spike indicator.
 */

import { ArrowUpRight, Waves } from 'lucide-react';
import { Link } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';
import { TierGate } from '@/modules/whale/components/TierGate';
import { useWhaleNetflow } from '@/modules/whale/hooks/useWhaleNetflow';
import { cn } from '@/lib/utils';

interface Props {
    isFree: boolean;
}

function formatNetFlow(usd: number): string {
    const abs = Math.abs(usd);
    if (abs >= 1_000_000_000) {
        return `$${(abs / 1_000_000_000).toFixed(1)}B`;
    }
    return `$${(abs / 1_000_000).toFixed(1)}M`;
}

function EssentialCard() {
    const { data: btcFlow, isLoading, error } = useWhaleNetflow('BTC');

    if (isLoading) {
        return <Skeleton className="h-32 w-full rounded-2xl bg-[#1a1a1a]" />;
    }

    if (error?.message === 'TIER_RESTRICTED') {
        return <TierGate />;
    }

    if (error || !btcFlow) {
        return (
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5">
                <p className="text-gray-500 text-sm">Whale data unavailable.</p>
            </div>
        );
    }

    const directionColor =
        btcFlow.flowDirection === 'bullish' ? 'text-emerald-400' :
            btcFlow.flowDirection === 'bearish' ? 'text-rose-400' :
                'text-amber-400';

    const directionBg =
        btcFlow.flowDirection === 'bullish' ? 'bg-emerald-500/10 border-emerald-500/20' :
            btcFlow.flowDirection === 'bearish' ? 'bg-rose-500/10 border-rose-500/20' :
                'bg-amber-500/10 border-amber-500/20';

    return (
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 space-y-4">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <Waves className={cn('w-4 h-4', directionColor)} aria-hidden="true" />
                    <span className="text-sm font-black text-white uppercase tracking-[0.15em]">BTC Whale Flow</span>
                    {btcFlow.flowSpike && (
                        <Waves className="w-4 h-4 text-amber-400 animate-pulse" aria-label="Spike detected" />
                    )}
                </div>
                <Link href="/features/whale">
                    <span className="flex items-center gap-1 text-xs text-[#C7AE6A] hover:text-[#d5c28f] transition-colors font-semibold">
                        Full Whale Watch <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                    </span>
                </Link>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
                {/* Net flow */}
                <div className="space-y-0.5">
                    <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest block">Net Flow</span>
                    <span className={cn('text-2xl font-black font-mono', directionColor)}>
                        {formatNetFlow(btcFlow.netFlowUsd)}
                    </span>
                </div>

                {/* Direction badge */}
                <div className={cn('px-3 py-1.5 rounded-lg border text-xs font-black uppercase tracking-widest', directionBg, directionColor)}>
                    {btcFlow.flowDirection}
                </div>

                {/* Confidence */}
                <div className="space-y-0.5">
                    <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest block">Confidence</span>
                    <span className="text-sm font-bold text-gray-300 capitalize">{btcFlow.confidenceBand}</span>
                </div>

                {/* Spike alert */}
                {btcFlow.flowSpike && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                        <Waves className="w-3 h-3 text-amber-400 animate-pulse" aria-hidden="true" />
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Spike</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export function WhaleWatchSection({ isFree }: Props) {
    return (
        <section role="region" aria-label="Whale Watch" data-testid="whale-watch-section">
            {isFree ? <TierGate /> : <EssentialCard />}
        </section>
    );
}
