/**
 * Catalyst Intelligence Engine — Hero Section
 *
 * Computes live hero metrics from real catalyst event data:
 *   - Next High Impact event name
 *   - Market consensus (bias of that event)
 *   - Volatility Score (max impact_score of upcoming events)
 *   - Events Today (count of same-day scheduled events)
 */

import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CatalystEvent } from "../types";

interface CatalystHeroProps {
    events: CatalystEvent[];
}

function formatEventLabel(event: CatalystEvent): string {
    if (event.event_type === 'earnings') {
        return `${event.ticker} ${event.fiscal_quarter}`;
    }
    return `${event.event_name} (${event.country})`;
}

export function CatalystHero({ events }: CatalystHeroProps) {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    const upcoming = events.filter(e => new Date(e.scheduled_time) > now);

    // Next High Impact = earliest upcoming where impact_band === 'High'
    const nextHigh = upcoming
        .filter(e => e.impact_band === 'High')
        .sort((a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime())[0];

    // Volatility Score = max impact_score of upcoming
    const maxScore = upcoming.length > 0
        ? Math.max(...upcoming.map(e => e.impact_score ?? 0))
        : 0;

    const maxScoreBand = maxScore >= 71 ? 'High' : maxScore >= 41 ? 'Medium' : 'Low';

    // Events Today
    const eventsToday = events.filter(e => e.scheduled_time.startsWith(todayStr)).length;

    // Market Consensus from nextHigh bias
    const consensus = nextHigh?.bias ?? 'Neutral';
    const consensusStyle = consensus === 'Risk-On'
        ? "text-emerald-500"
        : consensus === 'Risk-Off'
            ? "text-rose-500"
            : "text-gray-400";

    const scoreBandColor = maxScoreBand === 'High'
        ? "text-rose-500"
        : maxScoreBand === 'Medium'
            ? "text-amber-500"
            : "text-slate-400";

    return (
        <div className="bg-gradient-to-r from-[#C7AE6A]/10 via-[#0a0a0a] to-[#0a0a0a] border border-[#C7AE6A]/30 rounded-2xl overflow-hidden shadow-2xl mb-10">
            <div className="p-8 space-y-6">
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#C7AE6A]" />
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Catalyst Intelligence Engine</h3>
                </div>

                <div className="space-y-4">
                    {nextHigh ? (
                        <h2 className="text-2xl md:text-4xl font-black text-white leading-[1.1] tracking-tight">
                            Next High Impact:{" "}
                            <span className={cn(consensusStyle)}>{formatEventLabel(nextHigh)}</span>{" "}
                            <span className="text-gray-500">drives market catalyst.</span>
                        </h2>
                    ) : (
                        <h2 className="text-2xl md:text-4xl font-black text-white leading-[1.1] tracking-tight">
                            No upcoming high-impact events.{" "}
                            <span className="text-gray-500">Markets in hold pattern.</span>
                        </h2>
                    )}
                    <p className="text-gray-400 text-base leading-relaxed max-w-2xl font-medium">
                        Live macro and earnings catalysts, scored for impact and portfolio relevance.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-[#1a1a1a]">
                    <div className="space-y-1">
                        <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest block">Next high impact</span>
                        <span className="text-lg font-bold text-white font-mono truncate">
                            {nextHigh ? formatEventLabel(nextHigh) : '—'}
                        </span>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest block">Market consensus</span>
                        <span className={cn("text-lg font-bold font-mono", consensusStyle)}>
                            {consensus}
                        </span>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest block">Volatility score</span>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-[#C7AE6A] font-mono">{maxScore}</span>
                            <span className={cn("text-[9px] font-black uppercase tracking-widest", scoreBandColor)}>
                                {maxScoreBand}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest block">Events today</span>
                        <span className="text-lg font-bold text-white font-mono">
                            {eventsToday}{" "}
                            <span className="text-gray-600 text-[10px] uppercase font-bold">Total</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
