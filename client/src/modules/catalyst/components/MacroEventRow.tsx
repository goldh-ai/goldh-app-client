/**
 * Catalyst Intelligence Engine — Macro Event Row
 *
 * Renders a single macro catalyst event card in the feed list.
 * Adapted from MarketEventsMock EventRow to use live MacroEvent type.
 */

import { Globe, Clock, TrendingUp, TrendingDown, Activity, ShieldCheck, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MacroEvent } from "../types";

export interface WhaleConfirmation {
    netFlowUsd: number;
    baseline7d: number;
    flowDirection: 'bullish' | 'bearish' | 'neutral';
    confidenceBand: 'low' | 'medium' | 'high';
}

// ─── Sub-components ────────────────────────────────────────────────────────

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

const BiasChips = ({ assetBiases }: { assetBiases?: MacroEvent['asset_biases'] }) => {
    if (!assetBiases || assetBiases.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 pt-1">
            {assetBiases.map((b, i) => (
                <div key={i} className={cn(
                    "flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest border",
                    b.bias === 'Risk-On'
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-500 border-rose-500/20",
                )}>
                    {b.bias === 'Risk-On' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {b.sector}
                </div>
            ))}
        </div>
    );
};

// ─── MacroEventRow ─────────────────────────────────────────────────────────

interface MacroEventRowProps {
    event: MacroEvent;
    whaleConfirmation?: WhaleConfirmation;
    showNumericScores?: boolean;
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

export function MacroEventRow({ event, whaleConfirmation, showNumericScores = true }: MacroEventRowProps) {
    const band = event.impact_band ?? 'Low';
    const isReleased = event.actual_value != null;
    const time = event.scheduled_time
        ? new Date(event.scheduled_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' })
        : '—';

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
                            <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center border border-[#222]">
                                <span className="text-[10px] font-black text-[#C7AE6A]">{event.country}</span>
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-white leading-tight">{event.event_name}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <Globe className="w-3 h-3 text-gray-600" />
                                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{event.country} Market</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-600 font-medium">
                            <Clock className="w-3 h-3" />
                            {time} UTC
                        </div>
                    </div>

                    {/* Data Values Grid */}
                    <div className="flex items-center gap-6 p-3 rounded-lg bg-[#050505] border border-[#1a1a1a]">
                        <div className="space-y-1">
                            <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest block">Previous</span>
                            <span className="text-sm font-bold text-gray-400 font-mono">
                                {event.previous_value != null ? `${event.previous_value}${event.unit ? ` ${event.unit}` : ''}` : '—'}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest block">Forecast</span>
                            <span className="text-sm font-bold text-[#C7AE6A] font-mono">
                                {event.forecast_value != null ? `${event.forecast_value}${event.unit ? ` ${event.unit}` : ''}` : '—'}
                            </span>
                        </div>
                        {isReleased && (
                            <div className="space-y-1">
                                <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest block">Actual</span>
                                <span className="text-sm font-bold text-white font-mono">
                                    {event.actual_value}{event.unit ? ` ${event.unit}` : ''}
                                </span>
                            </div>
                        )}
                        <div className="ml-auto">
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
                            <div className="bg-[#111] rounded-lg p-3 space-y-2 border border-[#222]">
                                <p className={cn("text-xs font-bold uppercase tracking-widest", biasStyle)}>
                                    {biasLabel}
                                </p>
                                <BiasChips assetBiases={event.asset_biases} />
                            </div>
                        </div>
                    )}

                    {/* Whale Confirmation Chip — display only, no override of bias */}
                    {whaleConfirmation && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                            <Waves className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                            <div className="flex-1 min-w-0">
                                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                                    Whale confirmation
                                </span>
                                <p className="text-[10px] text-gray-400 mt-0.5">
                                    BTC exchange {whaleConfirmation.flowDirection === 'bullish' ? 'outflows' : 'inflows'} spiked to{' '}
                                    <span className={cn(
                                        'font-bold',
                                        whaleConfirmation.flowDirection === 'bullish' ? 'text-emerald-400' : 'text-rose-400'
                                    )}>
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(Math.abs(whaleConfirmation.netFlowUsd))}
                                    </span>
                                    {' '}({(Math.abs(whaleConfirmation.netFlowUsd) / Math.max(whaleConfirmation.baseline7d, 1)).toFixed(1)}× baseline) around this event.
                                    {' '}<span className="text-gray-600">{whaleConfirmation.confidenceBand} confidence</span>
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-4">
                            <div className="px-2 py-0.5 bg-[#C7AE6A]/10 border border-[#C7AE6A]/20 rounded-md">
                                <span className="text-[10px] font-black text-[#C7AE6A] uppercase tracking-widest">Macro</span>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-50">
                                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Verified institutional feed</span>
                            </div>
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
