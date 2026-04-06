/**
 * Catalyst Intelligence Engine — Earnings Event Row
 *
 * Renders a single earnings catalyst event card in the feed list.
 * Shows EPS consensus vs actual, surprise %, outcome label, and bias.
 */

import { Clock, TrendingUp, TrendingDown, Activity, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EarningsEvent } from "../types";
import { STREETScoreCatalystChip } from "./STREETScoreCatalystChip";

// ─── Sub-components ────────────────────────────────────────────────────────

const OutcomeChip = ({ label }: { label?: 'Beat' | 'Miss' | 'Inline' | null }) => {
    if (!label) return null;

    const styles = {
        Beat: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        Miss: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        Inline: "bg-gray-800 text-gray-400 border-gray-700",
    } as const;

    const icons = {
        Beat: <TrendingUp className="w-3 h-3" />,
        Miss: <TrendingDown className="w-3 h-3" />,
        Inline: <BarChart3 className="w-3 h-3" />,
    } as const;

    return (
        <div className={cn(
            "flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] uppercase font-bold tracking-widest",
            styles[label],
        )}>
            {icons[label]}
            {label}
        </div>
    );
};

const RelevanceBadge = ({ band }: { band?: 'Low' | 'Medium' | 'High' }) => {
    if (!band || band === 'Low') return null;

    const styles = {
        Medium: "text-blue-400 border-blue-400/20 bg-blue-400/5",
        High: "text-[#C7AE6A] border-[#C7AE6A]/20 bg-[#C7AE6A]/5",
    } as const;

    return (
        <div className={cn(
            "flex items-center gap-1.5 px-2 py-0.5 rounded border text-[9px] uppercase font-bold tracking-widest",
            styles[band],
        )}>
            <Activity className="w-3 h-3" />
            CIO Match: {band}
        </div>
    );
};

// ─── EarningsEventRow ──────────────────────────────────────────────────────

interface EarningsEventRowProps {
    event: EarningsEvent;
    showNumericScores?: boolean;
    tier?: string;
}

const IMPACT_COLORS = {
    Low: "bg-slate-500",
    Medium: "bg-amber-500",
    High: "bg-rose-500",
} as const;

const IMPACT_TEXT = {
    Low: "text-slate-400",
    Medium: "text-amber-500",
    High: "text-rose-500",
} as const;

export function EarningsEventRow({ event, showNumericScores = true, tier }: EarningsEventRowProps) {
    const band = event.impact_band ?? 'Low';
    const isReleased = event.actual_eps != null;
    const time = event.scheduled_time
        ? new Date(event.scheduled_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' })
        : '—';

    const surprise = event.eps_surprise_pct;
    const surpriseLabel = surprise != null
        ? `${surprise >= 0 ? '+' : ''}${surprise.toFixed(1)}%`
        : null;
    const surpriseColor = surprise != null
        ? surprise > 0 ? "text-emerald-400" : surprise < 0 ? "text-rose-400" : "text-gray-400"
        : "text-gray-400";

    const biasLabel = event.bias ?? 'Neutral';
    const biasStyle = biasLabel === 'Risk-On'
        ? "text-emerald-400"
        : biasLabel === 'Risk-Off'
            ? "text-rose-400"
            : "text-gray-400";

    return (
        <div className="group relative bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-0 hover:border-[#333] transition-all duration-300 hover:shadow-lg hover:-translate-y-[1px] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex p-5 gap-5">
                {/* Left: Impact Indicator */}
                <div className="flex flex-col items-center gap-2 pt-1">
                    <div className={cn("w-1 h-12 rounded-full", IMPACT_COLORS[band])} />
                    <span className={cn("text-[8px] font-black uppercase tracking-tighter", IMPACT_TEXT[band])}>
                        {band}
                    </span>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            {/* Ticker badge */}
                            <div className="px-2 py-1 rounded-lg bg-[#1a1a1a] border border-[#222] flex items-center justify-center min-w-[3rem]">
                                <span className="text-[11px] font-black text-[#C7AE6A] tracking-wide">{event.ticker}</span>
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-white leading-tight">{event.company_name}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{event.sector} · {event.fiscal_quarter}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-600 font-medium">
                            <Clock className="w-3 h-3" />
                            {time} UTC
                        </div>
                    </div>

                    {/* EPS Data Grid */}
                    <div className="flex items-center gap-6 p-3 rounded-lg bg-[#050505] border border-[#1a1a1a] flex-wrap">
                        <div className="space-y-1">
                            <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest block">EPS consensus</span>
                            <span className="text-sm font-bold text-gray-400 font-mono">
                                {event.consensus_eps != null ? `$${event.consensus_eps.toFixed(2)}` : '—'}
                            </span>
                        </div>
                        {isReleased && (
                            <>
                                <div className="space-y-1">
                                    <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest block">Actual EPS</span>
                                    <span className="text-sm font-bold text-white font-mono">
                                        {event.actual_eps != null ? `$${event.actual_eps.toFixed(2)}` : '—'}
                                    </span>
                                </div>
                                {surpriseLabel && (
                                    <div className="space-y-1">
                                        <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest block">Surprise</span>
                                        <span className={cn("text-sm font-bold font-mono", surpriseColor)}>
                                            {surpriseLabel}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <OutcomeChip label={event.outcome_label} />
                                </div>
                            </>
                        )}
                        <div className="ml-auto flex items-center gap-2">
                            <STREETScoreCatalystChip ticker={event.ticker} tier={tier} />
                            <RelevanceBadge band={event.relevance_band} />
                        </div>
                    </div>

                    {/* Bias Section */}
                    {event.bias && (
                        <div className="pt-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">Expected bias</span>
                                <div className="h-px w-24 bg-[#222]" />
                            </div>
                            <div className="bg-[#111] rounded-lg p-3 border border-[#222]">
                                <p className={cn("text-xs font-bold uppercase tracking-widest", biasStyle)}>
                                    {biasLabel}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-4">
                            <div className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-md">
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Earnings</span>
                            </div>
                            <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                                {event.country} · Equity
                            </span>
                        </div>
                        {showNumericScores && event.impact_score != null && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Score</span>
                                <span className={cn("text-sm font-black font-mono", IMPACT_TEXT[band])}>
                                    {event.impact_score}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
