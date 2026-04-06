/**
 * Dashboard2 — Tier-Aware Intelligence Dashboard
 *
 * Route: /home
 * Aggregates all GOLDH intelligence modules into a single tier-aware view.
 * Free users see gated/blurred content with upgrade prompts.
 * Essential+ users see full live content with zero upsell UI.
 *
 * Caching: all hooks use TanStack Query with in-memory cache (staleTime per hook).
 * Do not override staleTime — dashboard is served from memory on repeat visits.
 */

import { useMemo } from 'react';
import { useLocation } from 'wouter';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { HeroCard } from '@/components/shared/HeroCard';
import TierBanner from '@/modules/pulse/components/TierBanner';
import MorningPulseHero from '@/modules/pulse/components/MorningPulseHero';
import { useAuth } from '@/lib/auth';
import { usePulseOverview } from '@/modules/pulse/hooks/usePulseOverview';
import { MarketSnapshotSection } from './MarketSnapshotSection';
import { GuruTalkSection } from './GuruTalkSection';
import { CatalystSection } from './CatalystSection';
import { WhaleWatchSection } from './WhaleWatchSection';
import { CIOInsightsSection } from './CIOInsightsSection';

function getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

function LastUpdatedFooter() {
    const { data: overview } = usePulseOverview();
    const ts = overview?.data?.timestamp_utc;
    if (!ts) return null;
    return (
        <p className="text-center text-[10px] text-gray-600 font-medium pt-4">
            Data as of{' '}
            {new Date(ts).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short',
            })}
        </p>
    );
}

export default function Dashboard2() {
    const { user } = useAuth();
    const [, setLocation] = useLocation();

    const tier = user?.planTier ?? 'free';
    const isFree = tier === 'free';

    const { data: overview } = usePulseOverview();
    const assetGroups = overview?.data?.assetGroups ?? {};
    const allAssets = useMemo(() => Object.values(assetGroups).flat(), [assetGroups]);

    const totalAssets = useMemo(
        () => Object.values(assetGroups).reduce((sum, arr) => sum + arr.length, 0),
        [assetGroups]
    );
    const totalClasses = useMemo(
        () => Object.values(assetGroups).filter((arr) => arr.length > 0).length,
        [assetGroups]
    );
    const topMover = useMemo(() => {
        const withChange = allAssets.filter((a) => a.percentChange24h != null);
        if (!withChange.length) return undefined;
        const sorted = [...withChange].sort((a, b) => (b.percentChange24h ?? 0) - (a.percentChange24h ?? 0));
        const best = sorted[0];
        if (!best) return undefined;
        const ch = best.percentChange24h ?? 0;
        return { symbol: best.symbol, change: `${ch >= 0 ? '+' : ''}${ch.toFixed(2)}%`, positive: ch >= 0 };
    }, [allAssets]);
    const worstPerformer = useMemo(() => {
        const withChange = allAssets.filter((a) => a.percentChange24h != null);
        if (!withChange.length) return undefined;
        const sorted = [...withChange].sort((a, b) => (a.percentChange24h ?? 0) - (b.percentChange24h ?? 0));
        const worst = sorted[0];
        if (!worst) return undefined;
        const ch = worst.percentChange24h ?? 0;
        return { symbol: worst.symbol, change: `${ch >= 0 ? '+' : ''}${ch.toFixed(2)}%` };
    }, [allAssets]);

    const firstName = user?.name?.split(' ')[0] ?? '';
    const greeting = useMemo(
        () => (firstName ? `${getGreeting()}, ${firstName}` : getGreeting()),
        [firstName]
    );

    return (
        <AppLayout title="Intelligence">
            <div className="pb-16 px-4 sm:px-6 pt-6" data-testid="dashboard2-page">
                <div className="container mx-auto max-w-6xl space-y-6 animate-in fade-in duration-700">

                    {/* Tier banner — free only */}
                    {isFree && <TierBanner tier={tier} />}

                    {/* Greeting header */}
                    <PageHeader
                        title={greeting}
                        description="Your GOLDH intelligence center"
                    />

                    {/* Morning Pulse Hero */}
                    <MorningPulseHero
                        topMover={topMover}
                        worstPerformer={worstPerformer}
                        totalAssets={totalAssets}
                        totalClasses={totalClasses}
                    />

                    {/* Market Snapshot */}
                    <MarketSnapshotSection isFree={isFree} />

                    {/* 2-col grid: Guru Talk + Catalyst */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <GuruTalkSection isFree={isFree} />
                        <CatalystSection isFree={isFree} />
                    </div>

                    {/* Whale Watch */}
                    <WhaleWatchSection isFree={isFree} />

                    {/* CIO Insights — Essential+ only */}
                    {!isFree && <CIOInsightsSection />}

                    {/* Last updated footer */}
                    <LastUpdatedFooter />

                    {/* Upgrade CTA — free only */}
                    {isFree && (
                        <HeroCard
                            variant="promotional"
                            title="Unlock Full Intelligence"
                            subtitle="You're seeing 20% of GOLDH"
                            description="Essential unlocks real-time data across 100+ assets, whale tracking, full Guru insights, unlimited price alerts, and Catalyst Intelligence."
                            primaryAction={{
                                label: 'Select Essential — $29/mo',
                                onClick: () => setLocation('/pricing'),
                            }}
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
