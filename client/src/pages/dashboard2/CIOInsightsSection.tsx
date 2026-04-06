/**
 * Dashboard2 — CIO Insights Section (Essential+ only)
 *
 * Shows the most recent published content item of type 'brief'.
 * Empty state: Coming Soon card.
 */

import { useMemo } from 'react';
import { format } from 'date-fns';
import { ArrowUpRight, LineChart } from 'lucide-react';
import { Link } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';
import { useContent } from '@/hooks/useContent';

export function CIOInsightsSection() {
    const { data: contentItems, isLoading } = useContent();

    const latestBrief = useMemo(() => {
        if (!contentItems) return null;
        return [...contentItems]
            .filter((item) => item.type === 'brief' && item.status === 'published')
            .sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime())[0] ?? null;
    }, [contentItems]);

    if (isLoading) {
        return (
            <section role="region" aria-label="CIO Insights" data-testid="cio-insights-section" className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5">
                <Skeleton className="h-5 w-32 bg-[#1a1a1a] mb-4" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-2/3 bg-[#1a1a1a]" />
                    <Skeleton className="h-4 w-full bg-[#1a1a1a]" />
                    <Skeleton className="h-4 w-4/5 bg-[#1a1a1a]" />
                </div>
            </section>
        );
    }

    return (
        <section role="region" aria-label="CIO Insights" data-testid="cio-insights-section" className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <LineChart className="w-4 h-4 text-[#C7AE6A]" aria-hidden="true" />
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.15em]">CIO Insights</h3>
                </div>
                {latestBrief && (
                    <Link href="/insights">
                        <span className="flex items-center gap-1 text-xs text-[#C7AE6A] hover:text-[#d5c28f] transition-colors font-semibold">
                            All Briefs <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                        </span>
                    </Link>
                )}
            </div>

            {latestBrief ? (
                <div className="space-y-2">
                    <Link href="/insights">
                        <div className="group cursor-pointer space-y-2">
                            <p className="text-sm font-bold text-white group-hover:text-[#C7AE6A] transition-colors leading-snug">
                                {latestBrief.display_name}
                            </p>
                            {latestBrief.summary && (
                                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                                    {latestBrief.summary}
                                </p>
                            )}
                            <p className="text-[10px] text-gray-600 font-medium">
                                {format(new Date(latestBrief.uploaded_at), 'MMM d, yyyy')}
                            </p>
                        </div>
                    </Link>
                </div>
            ) : (
                <div className="py-2 space-y-1">
                    <p className="text-sm font-bold text-white">Coming Soon</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Strategic research and investment briefs from the GOLDH CIO.
                    </p>
                </div>
            )}
        </section>
    );
}
