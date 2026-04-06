/**
 * Dashboard2 — Catalyst Events Section
 *
 * Shows 2 upcoming events for all tiers.
 * Essential+: includes bias signals + cross_module_trigger indicator.
 */

import { useMemo } from 'react';
import { formatDistanceToNow, format, isPast } from 'date-fns';
import { ArrowUpRight, Zap } from 'lucide-react';
import { Link } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useCatalystEvents } from '@/modules/catalyst/hooks/useCatalystEvents';
import type { CatalystEvent } from '@/modules/catalyst/types';

interface Props {
    isFree: boolean;
}

function formatEventDate(scheduledTime: string): string {
    const d = new Date(scheduledTime);
    if (isPast(d)) return 'Today';
    const days = Math.ceil((d.getTime() - Date.now()) / 86_400_000);
    if (days <= 7) return formatDistanceToNow(d, { addSuffix: true });
    return format(d, 'MMM d');
}

function EventCard({ event, showBias }: { event: CatalystEvent; showBias: boolean }) {
    const label = event.event_type === 'earnings'
        ? `${event.ticker ?? ''} Earnings`.trim()
        : event.event_name;

    const biasLabel = event.bias ?? 'Neutral';
    const biasColor = biasLabel === 'Risk-On'
        ? 'text-emerald-400'
        : biasLabel === 'Risk-Off'
            ? 'text-rose-400'
            : 'text-amber-400';
    const biasBorder = biasLabel === 'Risk-On'
        ? 'border-emerald-500/20 bg-emerald-500/5'
        : biasLabel === 'Risk-Off'
            ? 'border-rose-500/20 bg-rose-500/5'
            : 'border-amber-500/20 bg-amber-500/5';

    return (
        <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-3.5 space-y-2">
            <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-white leading-tight line-clamp-2">{label}</p>
                <div className="flex items-center gap-1.5 shrink-0">
                    {/* Cross-module trigger indicator */}
                    {showBias && event.cross_module_trigger && (
                        <Zap className="w-3 h-3 text-[#C7AE6A]" aria-label="Cross-module trigger" />
                    )}
                    {/* Event type badge */}
                    <span className={cn(
                        'text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border',
                        event.event_type === 'macro'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    )}>
                        {event.event_type}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-500 font-medium">
                    {formatEventDate(event.scheduled_time)}
                </span>
            </div>

            {/* Bias banner (Essential only) */}
            {showBias && event.bias && (
                <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium', biasBorder)}>
                    <Zap className={cn('w-3 h-3 shrink-0', biasColor)} aria-hidden="true" />
                    <span className={cn('font-bold uppercase tracking-wide text-[10px]', biasColor)}>
                        {biasLabel}
                    </span>
                    <span className="text-gray-500 text-[10px]">bias signal</span>
                </div>
            )}
        </div>
    );
}

export function CatalystSection({ isFree }: Props) {
    const { data: catalystData, isLoading, error } = useCatalystEvents();
    const events = catalystData?.events ?? [];

    const displayEvents = useMemo(() => {
        const nowTs = Date.now();

        // For each type: prefer upcoming (soonest first), then most recent past
        const pickBest = (type: 'earnings' | 'macro', count: number): CatalystEvent[] => {
            const typed = events.filter((e) => e.event_type === type);
            const upcoming = typed
                .filter((e) => new Date(e.scheduled_time).getTime() > nowTs)
                .sort((a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime());
            const past = typed
                .filter((e) => new Date(e.scheduled_time).getTime() <= nowTs)
                .sort((a, b) => new Date(b.scheduled_time).getTime() - new Date(a.scheduled_time).getTime());
            return [...upcoming, ...past].slice(0, count);
        };

        const TARGET = 2;
        let eSlice = pickBest('earnings', TARGET);
        let mSlice = pickBest('macro', TARGET);

        const eShort = TARGET - eSlice.length;
        if (eShort > 0) mSlice = pickBest('macro', TARGET + eShort);

        const mShort = TARGET - mSlice.length;
        if (mShort > 0) eSlice = pickBest('earnings', TARGET + mShort);

        return [...eSlice, ...mSlice].sort(
            (a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime(),
        );
    }, [events]);

    return (
        <section role="region" aria-label="Catalyst Events" data-testid="catalyst-section" className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.15em]">Catalyst Events</h3>
                {!isFree && (
                    <Link href="/features/catalyst">
                        <span className="flex items-center gap-1 text-xs text-[#C7AE6A] hover:text-[#d5c28f] transition-colors font-semibold">
                            Full Calendar <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                        </span>
                    </Link>
                )}
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-3.5 space-y-2">
                            <Skeleton className="h-4 w-3/4 bg-[#1a1a1a]" />
                            <Skeleton className="h-3 w-1/3 bg-[#1a1a1a]" />
                            <Skeleton className="h-7 w-full bg-[#1a1a1a] rounded-lg" />
                        </div>
                    ))}
                </div>
            ) : error || displayEvents.length === 0 ? (
                <p className="text-gray-500 text-sm py-2">No catalyst events available.</p>
            ) : (
                <div className="space-y-3">
                    {/* Visible events */}
                    {displayEvents.map((event) => (
                        <EventCard
                            key={`${event.event_type}-${event.event_name}-${event.scheduled_time}`}
                            event={event}
                            showBias={!isFree}
                        />
                    ))}

                </div>
            )}
        </section>
    );
}
