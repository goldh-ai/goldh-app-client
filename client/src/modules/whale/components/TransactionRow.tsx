/**
 * Whale Watch — Transaction Row
 *
 * Renders a single whale transaction with direction indicator, wallet info,
 * chain badge, confidence score, and time-ago timestamp.
 */

import React from 'react';
import { Clock, Shield, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DirectionIndicator } from './DirectionIndicator';
import type { WhaleEvent, WalletClassification } from '../types';

interface TransactionRowProps {
    event: WhaleEvent;
    isSpike?: boolean;
}

function formatCurrency(val: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(val);
}

function getTimeAgo(isoString: string): string {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

const CLASSIFICATION_COLORS: Record<WalletClassification, string> = {
    exchange: 'text-rose-400',
    fund: 'text-emerald-400',
    custodian: 'text-blue-400',
    unknown: 'text-gray-500',
};

function ClassificationLabel({ cls }: { cls: WalletClassification }) {
    return (
        <span className={cn('text-[10px] font-bold uppercase', CLASSIFICATION_COLORS[cls])}>
            {cls}
        </span>
    );
}

export function TransactionRow({ event, isSpike }: TransactionRowProps) {
    const isInflow = event.direction === 'inflow';
    const directionColor = event.direction === 'inflow' ? 'text-rose-400' : 'text-emerald-400';

    return (
        <div className="group relative bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-0 hover:border-[#333] transition-all duration-300 hover:shadow-lg hover:-translate-y-[1px] overflow-hidden">
            <div className="flex p-5 gap-5">
                {/* Left: Direction Indicator */}
                <div className="flex flex-col items-center gap-2 pt-1">
                    <DirectionIndicator direction={event.direction} isSpike={isSpike} />
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0 space-y-3">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 shrink-0 rounded-lg bg-[#1a1a1a] flex items-center justify-center border border-[#222]">
                                <span className={cn('text-[10px] font-black', isInflow ? 'text-rose-500' : 'text-emerald-500')}>
                                    {event.assetSymbol}
                                </span>
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-xs font-black text-white leading-tight flex items-center gap-2 flex-wrap">
                                    {formatCurrency(event.amountUsd)}
                                    <span className="text-gray-600 font-mono font-normal text-[10px]">
                                        ({event.amountNative.toLocaleString(undefined, { maximumFractionDigits: 4 })} {event.assetSymbol})
                                    </span>
                                </h4>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className={cn('text-[9px] font-bold uppercase tracking-widest', directionColor)}>
                                        {event.direction}
                                    </span>
                                    <span className="text-gray-700">·</span>
                                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                                        {event.chain}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-600 font-medium shrink-0">
                            <Clock className="w-3 h-3" />
                            {getTimeAgo(event.timestamp)}
                        </div>
                    </div>

                    {/* From / To grid */}
                    <div className="grid grid-cols-2 gap-4 bg-[#111] rounded-lg p-3 border border-[#1a1a1a]">
                        <div className="space-y-1">
                            <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest block">From</span>
                            <div className="flex items-center gap-2 min-w-0">
                                <ClassificationLabel cls={event.walletClassification} />
                                <span className="text-[10px] text-gray-300 truncate max-w-[100px]">
                                    {event.fromWallet}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-1 text-right">
                            <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest block">To</span>
                            <div className="flex items-center justify-end gap-2 min-w-0">
                                <span className="text-[10px] text-gray-300 truncate max-w-[100px]">
                                    {event.toWallet}
                                </span>
                                <ClassificationLabel cls={event.walletClassification} />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-1">
                        <div className="px-2 py-0.5 bg-[#1a1a1a] border border-[#222] rounded-md flex items-center gap-1.5">
                            <Shield className="w-3 h-3 text-[#C7AE6A]" />
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                                Confidence {event.confidenceScore}%
                            </span>
                            <span className={cn(
                                'text-[9px] font-bold uppercase tracking-widest',
                                event.confidenceBand === 'high' ? 'text-emerald-500' :
                                    event.confidenceBand === 'medium' ? 'text-amber-500' : 'text-gray-600'
                            )}>
                                {event.confidenceBand}
                            </span>
                        </div>
                        <button
                            className="flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-white font-bold uppercase tracking-widest transition-colors group/btn"
                            onClick={() => {
                                // Open explorer link if txId looks like a hash
                                const chain = event.chain.toUpperCase();
                                const baseUrl = chain === 'BTC'
                                    ? `https://mempool.space/tx/${event.txId}`
                                    : `https://etherscan.io/tx/${event.txId}`;
                                window.open(baseUrl, '_blank', 'noopener,noreferrer');
                            }}
                        >
                            Explore hash
                            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
