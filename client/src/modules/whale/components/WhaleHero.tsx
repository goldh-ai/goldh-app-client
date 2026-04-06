/**
 * Whale Watch — Hero Section
 *
 * Displays live BTC + ETH net flow stats from the server cache.
 * Spike indicators pulse amber when flow_spike = true.
 * Shows "Institutional Pulse — Live" header with GOLDH gold branding.
 */

import React from 'react';
import { Waves } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NetFlowResponse, FlowDirection } from '../types';

interface WhaleHeroProps {
    btcFlow: NetFlowResponse | null | undefined;
    ethFlow: NetFlowResponse | null | undefined;
    isLoading?: boolean;
}

function formatCurrency(val: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(val);
}

function flowColorClass(direction: FlowDirection | undefined, netFlowUsd: number | undefined): string {
    if (direction === 'bullish') return 'text-emerald-500';
    if (direction === 'bearish') return 'text-rose-500';
    if (netFlowUsd !== undefined && netFlowUsd > 0) return 'text-rose-500';
    if (netFlowUsd !== undefined && netFlowUsd < 0) return 'text-emerald-500';
    return 'text-gray-400';
}

interface FlowStatProps {
    label: string;
    flow: NetFlowResponse | null | undefined;
    isLoading?: boolean;
}

function FlowStat({ label, flow, isLoading }: FlowStatProps) {
    return (
        <div className="space-y-1">
            <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest block">
                {label} Net Flow
            </span>
            {isLoading ? (
                <div className="h-6 w-24 bg-[#1a1a1a] rounded animate-pulse" />
            ) : flow ? (
                <div className="flex items-center gap-2">
                    <span className={cn('text-lg font-bold font-mono', flowColorClass(flow.flowDirection, flow.netFlowUsd))}>
                        {formatCurrency(Math.abs(flow.netFlowUsd))}
                    </span>
                    {flow.flowSpike && (
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" title="Spike detected" />
                    )}
                </div>
            ) : (
                <span className="text-lg font-bold font-mono text-gray-600">—</span>
            )}
        </div>
    );
}

export function WhaleHero({ btcFlow, ethFlow, isLoading }: WhaleHeroProps) {
    const spikeActive = btcFlow?.flowSpike || ethFlow?.flowSpike;

    return (
        <div className="bg-gradient-to-r from-[#C7AE6A]/10 via-[#0a0a0a] to-[#0a0a0a] border border-[#C7AE6A]/30 rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Waves className="w-32 h-32 text-[#C7AE6A]" />
            </div>

            <div className="p-6 md:p-8 space-y-6 relative z-10">
                <div className="flex items-center gap-2">
                    <Waves className="w-5 h-5 text-[#C7AE6A]" />
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                        Institutional Pulse — Live
                    </h3>
                    {spikeActive && (
                        <span className="ml-2 px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 rounded-full text-[9px] font-black text-amber-400 uppercase tracking-widest animate-pulse">
                            Spike Active
                        </span>
                    )}
                </div>

                <div className="space-y-3">
                    <h2 className="text-xl md:text-2xl font-black text-white leading-[1.1] tracking-tight">
                        {spikeActive
                            ? <>Net exchange flows spiked above baseline for <span className="text-amber-400">BTC/ETH</span>.</>
                            : <>Live on-chain whale flow monitoring for <span className="text-[#C7AE6A]">BTC</span> and <span className="text-[#C7AE6A]">ETH</span>.</>
                        }
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl font-medium">
                        Tracks institutional transfers ≥ $250K USD. Inflows to exchanges may signal sell pressure; outflows suggest accumulation.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-[#1a1a1a]">
                    <FlowStat label="BTC" flow={btcFlow} isLoading={isLoading} />
                    <FlowStat label="ETH" flow={ethFlow} isLoading={isLoading} />

                    <div className="space-y-1">
                        <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest block">BTC Baseline (7d)</span>
                        {isLoading ? (
                            <div className="h-6 w-20 bg-[#1a1a1a] rounded animate-pulse" />
                        ) : (
                            <span className="text-lg font-bold font-mono text-gray-400">
                                {btcFlow ? formatCurrency(btcFlow.baseline7d) : '—'}
                            </span>
                        )}
                    </div>

                    <div className="space-y-1">
                        <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest block">Signal</span>
                        {isLoading ? (
                            <div className="h-6 w-20 bg-[#1a1a1a] rounded animate-pulse" />
                        ) : (
                            <span className={cn(
                                'text-lg font-bold uppercase tracking-wide',
                                btcFlow?.flowDirection === 'bullish' ? 'text-emerald-500' :
                                    btcFlow?.flowDirection === 'bearish' ? 'text-rose-500' : 'text-gray-500'
                            )}>
                                {btcFlow?.flowDirection ?? '—'}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
