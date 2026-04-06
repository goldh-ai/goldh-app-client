/**
 * Dashboard2 — Market Snapshot Section
 *
 * Free: 6 fixed assets (BTC, ETH, SOL, S&P 500, Gold, DXY), price + 24h% only.
 * Essential+: Top 8 assets (crypto-first), price + 24h% + sparkline7d.
 */

import { useMemo } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { usePulseOverview } from '@/modules/pulse/hooks/usePulseOverview';
import { cn } from '@/lib/utils';
import type { PulseAsset } from '@/modules/pulse/types';

interface Props {
    isFree: boolean;
}

// Free tier: 6 fixed symbols to display — verify against live Pulse data symbols
// console.log('Available symbols:', Object.values(assetGroups).flat().map(a => a.symbol));
const FREE_FIXED_SYMBOLS = ['BTC', 'ETH', 'SOL', '^GSPC', 'GC=F', 'DX-Y.NYB'];

const DISPLAY_NAMES: Record<string, string> = {
    '^GSPC': 'S&P 500',
    'GC=F': 'Gold',
    'DX-Y.NYB': 'DXY',
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'SOL': 'Solana',
};

// Asset class order for Essential sort: crypto first, then others alphabetically
const CLASS_ORDER = ['crypto', 'equity', 'index', 'commodity', 'bond', 'etf', 'fx'];

function formatPrice(price: number | null): string {
    if (price == null) return '—';
    if (price >= 1000) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(price);
}

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
    if (!data?.length || data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const pts = data
        .map((v, i) => `${(i / (data.length - 1)) * 40},${20 - ((v - min) / range) * 20}`)
        .join(' ');
    return (
        <svg width="40" height="20" className="shrink-0" aria-hidden="true">
            <polyline points={pts} fill="none" stroke={positive ? '#34d399' : '#f87171'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function AssetCard({ asset, showSparkline }: { asset: PulseAsset; showSparkline: boolean }) {
    const displayName = DISPLAY_NAMES[asset.symbol] ?? asset.name;
    const pct = asset.percentChange24h;
    const positive = pct != null && pct >= 0;
    const sparklinePositive = asset.sparkline7d && asset.sparkline7d.length >= 2
        ? asset.sparkline7d[asset.sparkline7d.length - 1] >= asset.sparkline7d[0]
        : positive;

    return (
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-3 flex items-center gap-3 hover:border-[#C7AE6A]/20 transition-colors">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-mono">{asset.symbol}</span>
                    <span className="text-[10px] text-gray-600 truncate">{displayName}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-semibold text-gray-200">{formatPrice(asset.price)}</span>
                    {pct != null ? (
                        <span className={cn('text-xs font-bold', positive ? 'text-emerald-400' : 'text-rose-400')}>
                            {positive ? '+' : ''}{pct.toFixed(2)}%
                        </span>
                    ) : (
                        <span className="text-xs text-gray-600">—</span>
                    )}
                </div>
            </div>
            {showSparkline && asset.sparkline7d && asset.sparkline7d.length >= 2 && (
                <Sparkline data={asset.sparkline7d} positive={sparklinePositive} />
            )}
        </div>
    );
}

export function MarketSnapshotSection({ isFree }: Props) {
    const { data: overview, isLoading, error } = usePulseOverview();
    const assetGroups = overview?.data?.assetGroups ?? {};

    const allAssets = useMemo(() => Object.values(assetGroups).flat(), [assetGroups]);

    const displayAssets = useMemo(() => {
        if (isFree) {
            // 6 fixed symbols
            const result: PulseAsset[] = [];
            for (const sym of FREE_FIXED_SYMBOLS) {
                const found = allAssets.find((a) => a.symbol === sym);
                if (found) {
                    result.push(found);
                } else {
                    // Symbol not found in live data — log for dev verification, skip silently
                    if (process.env.NODE_ENV === 'development') {
                        console.warn(`[MarketSnapshot] Free symbol not found in Pulse data: ${sym}`);
                        console.log('[MarketSnapshot] Available symbols:', allAssets.map((a) => a.symbol));
                    }
                }
            }
            return result;
        } else {
            // Top 8: crypto-first, then by class order
            const sorted = [...allAssets].sort((a, b) => {
                const ai = CLASS_ORDER.indexOf(a.assetClass);
                const bi = CLASS_ORDER.indexOf(b.assetClass);
                return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
            });
            return sorted.slice(0, 8);
        }
    }, [allAssets, isFree]);

    const totalAssets = allAssets.length;

    if (isLoading) {
        return (
            <section role="region" aria-label="Market Snapshot" data-testid="market-snapshot-section" className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-5 w-32 bg-[#1a1a1a]" />
                    <Skeleton className="h-4 w-20 bg-[#1a1a1a]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-14 rounded-xl bg-[#1a1a1a]" />
                    ))}
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section role="region" aria-label="Market Snapshot" data-testid="market-snapshot-section" className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5">
                <p className="text-gray-500 text-sm">Market data temporarily unavailable.</p>
            </section>
        );
    }

    return (
        <section role="region" aria-label="Market Snapshot" data-testid="market-snapshot-section" className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.15em]">
                        {isFree ? 'Market Snapshot' : 'Your Market Overview'}
                    </h3>
                    <p className="text-[10px] text-gray-600 mt-0.5">
                        {isFree
                            ? `Tracking 6 of ${totalAssets > 0 ? totalAssets : '100'}+ assets`
                            : 'Top assets across all classes'}
                    </p>
                </div>
                {!isFree && (
                    <Link href="/features/pulse">
                        <span className="flex items-center gap-1 text-xs text-[#C7AE6A] hover:text-[#d5c28f] transition-colors font-semibold">
                            Full Pulse Terminal <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                        </span>
                    </Link>
                )}
            </div>

            {displayAssets.length === 0 ? (
                <div className="flex items-center gap-2 text-gray-600 text-sm py-4">
                    <TrendingUp className="w-4 h-4" />
                    <span>Market data loading…</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {displayAssets.map((asset) => (
                        <AssetCard key={asset.symbol} asset={asset} showSparkline={!isFree} />
                    ))}
                </div>
            )}
        </section>
    );
}
