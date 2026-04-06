/**
 * Dashboard2 — Guru Talk Preview Section
 *
 * Shows 2 most-recent insights (source-diversity: 1 per guru).
 * Essential+: includes "Full Feed" link.
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ArrowUpRight, BookOpen, Building, ShieldCheck, User } from 'lucide-react';
import { Link } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { GuruInsight } from '@shared/types';

interface Props {
    isFree: boolean;
}

function getAuthHeaders(): Record<string, string> {
    const sessionId = localStorage.getItem('sessionId');
    return sessionId ? { Authorization: `Bearer ${sessionId}` } : {};
}

function GuruIcon({ type }: { type: string }) {
    const cls = 'w-5 h-5';
    if (type === 'Institution') return <Building className={cn(cls, 'text-blue-400')} />;
    if (type === 'Analyst') return <BookOpen className={cn(cls, 'text-emerald-400')} />;
    if (type === 'Insider') return <ShieldCheck className={cn(cls, 'text-rose-400')} />;
    return <User className={cn(cls, 'text-[#C7AE6A]')} />;
}

function InsightCard({ insight }: { insight: GuruInsight }) {
    return (
        <div className="bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#C7AE6A]/30 rounded-2xl p-4 flex flex-col gap-3 transition-colors h-full">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#111] border border-[#222] flex items-center justify-center shrink-0">
                        <GuruIcon type={insight.guruEntityType} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white leading-tight line-clamp-1">{insight.guruDisplayName}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{insight.guruEntityType}</p>
                    </div>
                </div>
                <div className="shrink-0 text-[10px] text-gray-600 font-bold bg-[#111] px-2 py-1 rounded-md border border-[#222] flex items-center gap-1">
                    {format(new Date(insight.sourceTimestamp), 'MMM d')}
                </div>
            </div>

            {/* Asset + Action */}
            <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-white tracking-tight">{insight.assetSymbol}</span>
                <Badge variant="outline" className={cn(
                    'uppercase text-[10px] font-black tracking-widest border px-2 py-0.5',
                    insight.actionType === 'BUY' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        insight.actionType === 'SELL' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            'bg-[#111] text-gray-500 border-[#222]'
                )}>
                    {insight.actionType}
                </Badge>
            </div>

            {/* Summary */}
            <p className="text-sm text-gray-400 leading-relaxed italic line-clamp-3 flex-1">
                &ldquo;{insight.summaryText}&rdquo;
            </p>

            {/* Footer */}
            <div className="pt-3 border-t border-[#1a1a1a] flex items-center gap-2">
                <Badge variant="secondary" className="bg-[#111] text-gray-500 text-[10px] font-bold border border-[#222] uppercase tracking-widest px-2 py-0.5">
                    {insight.assetClass}
                </Badge>
                {insight.sentiment && (
                    <Badge variant="outline" className={cn(
                        'text-[10px] font-black uppercase tracking-widest border whitespace-nowrap px-2 py-0.5',
                        insight.sentiment === 'Positive' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' :
                            insight.sentiment === 'Negative' ? 'text-red-500 border-red-500/20 bg-red-500/5' :
                                'text-gray-500 border-[#222] bg-[#111]'
                    )}>
                        {insight.sentiment}
                    </Badge>
                )}
            </div>
        </div>
    );
}

export function GuruTalkSection({ isFree }: Props) {
    const limit = 2;

    const { data: guruData, isLoading } = useQuery<{ items: GuruInsight[]; lastDocId?: string }>({
        queryKey: ['guru-talk-preview'],
        queryFn: async () => {
            const res = await fetch('/api/news/guru-talk?limit=100&skipSort=true', {
                headers: getAuthHeaders(),
                credentials: 'include',
            });
            if (!res.ok) throw new Error(`Guru talk fetch failed: ${res.status}`);
            return res.json();
        },
        staleTime: 5 * 60 * 1000,
    });

    const rawInsights = guruData?.items ?? [];

    const selectedInsights = useMemo(() => {
        if (!rawInsights.length) return [];

        // Quality filter first
        const qualified = rawInsights.filter(
            (i) => i.sentiment != null && i.summaryText?.trim() !== ''
        );
        // Fallback: if quality filter eliminates all, use recency-only
        const pool = qualified.length > 0 ? qualified : rawInsights;

        // Group by guru, take most recent per guru
        const seenGurus = new Set<string>();
        const perGuru: GuruInsight[] = [];
        [...pool]
            .sort((a, b) => new Date(b.sourceTimestamp).getTime() - new Date(a.sourceTimestamp).getTime())
            .forEach((i) => {
                if (!seenGurus.has(i.guruDisplayName)) {
                    seenGurus.add(i.guruDisplayName);
                    perGuru.push(i);
                }
            });

        return perGuru.slice(0, limit);
    }, [rawInsights, limit]);

    return (
        <section role="region" aria-label="Guru Talk Preview" data-testid="guru-talk-section" className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.15em]">Guru Talk</h3>
                {!isFree && (
                    <Link href="/features/guru-talk">
                        <span className="flex items-center gap-1 text-xs text-[#C7AE6A] hover:text-[#d5c28f] transition-colors font-semibold">
                            Full Feed <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                        </span>
                    </Link>
                )}
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-4 space-y-3">
                            <Skeleton className="h-9 w-full bg-[#1a1a1a] rounded-xl" />
                            <Skeleton className="h-4 w-3/4 bg-[#1a1a1a]" />
                            <Skeleton className="h-12 w-full bg-[#1a1a1a]" />
                        </div>
                    ))}
                </div>
            ) : selectedInsights.length === 0 ? (
                <p className="text-gray-500 text-sm py-2">Intelligence feed loading…</p>
            ) : (
                <div className="space-y-3">
                    {/* Visible cards */}
                    {selectedInsights.map((insight) => (
                        <InsightCard key={insight.insightId} insight={insight} />
                    ))}

                </div>
            )}
        </section>
    );
}
