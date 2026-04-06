/**
 * Whale Watch — Main Page
 *
 * Composes: WhaleHero + FilterBar + Transaction list + pagination.
 * Free-tier users see the TierGate overlay instead of real data.
 * Essential+ users get full access with BTC + ETH whale feed.
 */

import React, { useState } from 'react';
import { Waves, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/AppLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuth } from '@/lib/auth';
import { WhaleHero } from './components/WhaleHero';
import { TransactionRow } from './components/TransactionRow';
import { FilterBar } from './components/FilterBar';
import { TierGate } from './components/TierGate';
import { useWhaleEvents } from './hooks/useWhaleEvents';
import { useWhaleNetflow } from './hooks/useWhaleNetflow';
import type { WhaleEventsFilter } from './types';

function isEssentialOrAbove(tier: string): boolean {
    return ['essential', 'pro', 'elite', 'admin'].includes(tier);
}

export default function WhaleWatchPage() {
    const { user } = useAuth();
    const tier = user?.planTier ?? 'free';
    const hasAccess = isEssentialOrAbove(tier);

    const [filter, setFilter] = useState<WhaleEventsFilter>({
        page: 1,
        pageSize: 50,
    });
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 300);

    const eventsQuery = useWhaleEvents(hasAccess ? filter : {});
    const btcFlowQuery = useWhaleNetflow('BTC');
    const ethFlowQuery = useWhaleNetflow('ETH');

    function handleFilterChange(next: Partial<WhaleEventsFilter>) {
        setFilter((prev) => ({ ...prev, ...next }));
    }

    const events = eventsQuery.data?.events ?? [];

    const filteredEvents = React.useMemo(() => {
        if (!debouncedSearch) return events;
        const q = debouncedSearch.toLowerCase();
        return events.filter(e =>
            e.assetSymbol.toLowerCase().includes(q) ||
            e.fromWallet.toLowerCase().includes(q) ||
            e.toWallet.toLowerCase().includes(q) ||
            e.txId.toLowerCase().includes(q)
        );
    }, [events, debouncedSearch]);

    const totalCount = eventsQuery.data?.totalCount ?? 0;
    const pageSize = filter.pageSize ?? 50;
    const currentPage = filter.page ?? 1;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    const isTierError = eventsQuery.error?.message === 'TIER_RESTRICTED';

    return (
        <AppLayout title="Whale Watch">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-8 pb-20 animate-in fade-in duration-700">

                {/* Hero */}
                <WhaleHero
                    btcFlow={btcFlowQuery.data}
                    ethFlow={ethFlowQuery.data}
                    isLoading={btcFlowQuery.isLoading || ethFlowQuery.isLoading}
                />

                {/* Gated content */}
                {!hasAccess || isTierError ? (
                    <TierGate />
                ) : (
                    <div className="space-y-6">
                        {/* Filter bar */}
                        <FilterBar
                            filter={filter}
                            onChange={handleFilterChange}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />

                        {/* Transaction list */}
                        {eventsQuery.isLoading ? (
                            <div className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-5 flex gap-5">
                                        <Skeleton className="w-1 h-14 rounded-full bg-[#1a1a1a]" />
                                        <div className="flex-1 space-y-3">
                                            <Skeleton className="h-4 w-36 bg-[#1a1a1a]" />
                                            <Skeleton className="h-3 w-24 bg-[#1a1a1a]" />
                                            <div className="grid grid-cols-2 gap-4 bg-[#111] rounded-lg p-3">
                                                <Skeleton className="h-3 w-2/3 bg-[#222]" />
                                                <Skeleton className="h-3 w-2/3 bg-[#222] ml-auto" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : eventsQuery.isError && !isTierError ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                <AlertTriangle className="w-10 h-10 text-amber-500" />
                                <p className="text-gray-400 font-medium">Failed to load whale events. Please try again.</p>
                                <Button
                                    variant="ghost"
                                    onClick={() => eventsQuery.refetch()}
                                    className="text-[#C7AE6A] border border-[#C7AE6A]/30 hover:bg-[#C7AE6A]/10 text-xs uppercase tracking-widest"
                                >
                                    Retry
                                </Button>
                            </div>
                        ) : events.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                                <Waves className="w-10 h-10 text-gray-700" />
                                <p className="text-gray-500 font-medium">No whale events in the last 24 hours matching your filters.</p>
                                <button
                                    onClick={() => setFilter({ page: 1, pageSize: 50 })}
                                    className="text-[10px] text-[#C7AE6A] font-bold uppercase tracking-widest hover:underline"
                                >
                                    Clear filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {filteredEvents.map((event) => (
                                        <TransactionRow
                                            key={`${event.txId}-${event.chain}`}
                                            event={event}
                                            isSpike={
                                                (event.chain === 'BTC' && btcFlowQuery.data?.flowSpike) ||
                                                (event.chain === 'ETH' && ethFlowQuery.data?.flowSpike) ||
                                                false
                                            }
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between pt-4">
                                        <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                                            {totalCount.toLocaleString()} events · Page {currentPage} of {totalPages}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                disabled={currentPage <= 1}
                                                onClick={() => handleFilterChange({ page: currentPage - 1 })}
                                                className="text-gray-400 border border-[#222] hover:border-[#333] disabled:opacity-30"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                disabled={currentPage >= totalPages}
                                                onClick={() => handleFilterChange({ page: currentPage + 1 })}
                                                className="text-gray-400 border border-[#222] hover:border-[#333] disabled:opacity-30"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="pt-12 text-center">
                    <div className="inline-flex items-center gap-4 px-6 py-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-full">
                        <span className="text-[9px] text-gray-700 font-black uppercase tracking-[0.4em]">
                            Proprietary on-chain engine
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                            GOLDH.ai
                        </span>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
