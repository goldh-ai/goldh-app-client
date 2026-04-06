import { useParams, useLocation } from 'wouter';
import { ArrowLeft, AlertTriangle, Info, Database, X } from 'lucide-react';
import { Header } from '@/components/Header';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import ConfidenceBadge from './components/ConfidenceBadge';
import TierBanner from './components/TierBanner';
import { AlertsBellPlaceholder } from './components/AlertsBellPlaceholder';
import { usePulseAsset, usePulseOverview } from './hooks/usePulseOverview';
import { PageHeader } from '@/components/shared/PageHeader';

function formatPrice(price: number | null): string {
  if (price == null) return '—';
  if (price < 0.01) return price.toFixed(6);
  if (price < 1) return price.toFixed(4);
  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatVolume(volume: number | null): string {
  if (volume == null) return '—';
  if (volume >= 1_000_000_000) return `${(volume / 1_000_000_000).toFixed(2)}B`;
  if (volume >= 1_000_000) return `${(volume / 1_000_000).toFixed(2)}M`;
  if (volume >= 1_000) return `${(volume / 1_000).toFixed(1)}K`;
  return volume.toLocaleString();
}

function cn(...c: unknown[]) { return (c.filter(Boolean) as string[]).join(' '); }

export default function PulseAssetDetailPage() {
  const params = useParams<{ symbol: string }>();
  const [, setLocation] = useLocation();
  const symbol = params.symbol?.toUpperCase();

  const { data: detail, isLoading, error } = usePulseAsset(symbol);
  const { data: overview } = usePulseOverview();
  const tier = overview?.tier ?? 'free';

  const asset = detail?.asset;
  const explanation = detail?.movementContext?.explanation;
  const change = asset?.percentChange24h;
  const changePositive = change != null && change > 0;
  const changeNeutral = change == null || change === 0;
  const changeColor = changeNeutral
    ? 'text-[#6b6b6b]'
    : changePositive
      ? 'text-emerald-500'
      : 'text-red-500';

  const freshnessColor = (mins: number) =>
    mins <= 5 ? 'text-emerald-500' : mins <= 30 ? 'text-amber-500' : 'text-red-500';
  const freshnessBg = (mins: number) =>
    mins <= 5 ? 'bg-emerald-500' : mins <= 30 ? 'bg-amber-500' : 'bg-red-500';
  const freshnessMinutes = asset
    ? Math.floor((Date.now() - new Date(asset.lastUpdated).getTime()) / 60000)
    : 0;

  return (
    <>
      <Header />
      {/* Slide-out panel style: fixed right sidebar on md+ */}
      <div
        className="fixed inset-y-0 right-0 w-full md:w-[520px] bg-[#0a0a0a] border-l border-[#1a1a1a] z-50 flex flex-col shadow-2xl"
        data-testid="pulse-asset-detail-page"
        role="dialog"
        aria-label={asset ? `${asset.name} details` : 'Asset details'}
      >
        {/* ─── Header bar ─────────────────────────────────────────────── */}
        <div className="px-6 py-4 border-b border-[#1a1a1a] bg-[#0c0c0c] shrink-0">
          <PageHeader
            label="Pulse Asset"
            title={asset ? asset.symbol : symbol ?? 'Asset'}
            description={asset?.name ?? undefined}
            icon={<ArrowLeft className="w-5 h-5 cursor-pointer hover:text-white transition-colors" onClick={() => setLocation('/pulse/overview')} />}
            actions={
              <button
                onClick={() => setLocation('/pulse/overview')}
                className="p-2 hover:bg-[#1a1a1a] rounded-lg text-[#6b6b6b] hover:text-white transition-colors"
                aria-label="Back to Pulse overview"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            }
            className="mb-0" // Remove default margin-bottom
          />
        </div>

        {/* Tier banner (free-tier only) */}
        {asset && <div className="px-6 pt-4 shrink-0"><TierBanner tier={tier} /></div>}

        {/* ─── Scrollable content ──────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Loading */}
          {isLoading && (
            <div className="space-y-4" aria-busy="true" aria-label="Loading asset details">
              <Skeleton className="h-12 w-48 bg-[#1a1a1a]" />
              <Skeleton className="h-4 w-32 bg-[#1a1a1a]" />
              <Skeleton className="h-32 w-full bg-[#1a1a1a] rounded-xl" />
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <div role="alert" className="flex flex-col items-center justify-center py-16 text-center">
              <AlertTriangle size={32} className="text-[#6b6b6b] mb-3" aria-hidden="true" />
              <p className="text-[#DDD5C3] font-medium mb-1">Asset not found</p>
              <p className="text-[#6b6b6b] text-sm">{error.message}</p>
            </div>
          )}

          {/* Content */}
          {asset && !isLoading && (
            <>
              {/* ─── Price & Change ─────────────────────────────────── */}
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-[#6b6b6b] mb-1">Current price</div>
                    <div className="text-3xl font-mono font-bold text-[#DDD5C3]">
                      {asset.price != null ? `$${formatPrice(asset.price)}` : '—'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn('text-base font-mono font-bold', changeColor)}
                      aria-label={`24h change: ${change != null ? `${change > 0 ? '+' : ''}${change.toFixed(2)}%` : 'delayed'}`}
                    >
                      {change != null ? `${change > 0 ? '+' : ''}${change.toFixed(2)}%` : '—'}
                    </span>
                    <span className="text-[#6b6b6b] text-xs">24h Change</span>
                    <span className="ml-auto">
                      <AlertsBellPlaceholder tier={tier} />
                    </span>
                  </div>
                </div>
              </div>

              {/* ─── Performance Grid ────────────────────────────────── */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'H24', value: change != null ? `${change > 0 ? '+' : ''}${change.toFixed(2)}%` : '—', color: changeColor },
                  { label: '7D', value: asset.sevenDayChange != null ? `${asset.sevenDayChange >= 0 ? '+' : ''}${asset.sevenDayChange.toFixed(1)}%` : '—', color: 'text-[#6b6b6b]' },
                  { label: 'Vol 24h', value: formatVolume(asset.volume24h), color: 'text-[#DDD5C3]' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-[#050505] border border-[#1a1a1a] p-3 rounded-xl text-center">
                    <span className="text-[9px] text-[#4a4a4a] font-black uppercase tracking-widest block mb-1">{label}</span>
                    <span className={cn('text-sm font-mono font-bold', color)}>{value}</span>
                  </div>
                ))}
              </div>

              {/* ─── Data Trust Layer ────────────────────────────────── */}
              <div className="bg-[#050505] border border-[#1a1a1a] rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#C7AE6A]" aria-hidden="true" />
                  <h3 className="text-[9px] font-black text-white uppercase tracking-widest">Data trust layer</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center space-y-1">
                    <span className="text-[9px] text-[#4a4a4a] font-black uppercase block">Confidence</span>
                    <ConfidenceBadge
                      confidenceScore={asset.confidenceScore}
                      confidenceBadge={asset.confidenceBadge}
                    />
                  </div>
                  <div className="text-center space-y-1">
                    <span className="text-[9px] text-[#4a4a4a] font-black uppercase block">Freshness</span>
                    <div className="flex items-center justify-center gap-1">
                      <div className={cn('w-2 h-2 rounded-full', freshnessBg(freshnessMinutes))} aria-hidden="true" />
                      <span className={cn('text-sm font-mono font-bold', freshnessColor(freshnessMinutes))}>
                        {freshnessMinutes}m ago
                      </span>
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <span className="text-[9px] text-[#4a4a4a] font-black uppercase block">Score</span>
                    <span className="text-sm font-mono font-bold text-white">{asset.confidenceScore}</span>
                  </div>
                </div>
              </div>

              {/* ─── Last Updated ────────────────────────────────────── */}
              <div className="text-xs text-[#6b6b6b] flex items-center gap-1.5">
                <span className="font-medium">Last updated:</span>
                {new Date(asset.lastUpdated).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short',
                })}
              </div>

              {/* ─── Movement Analysis ──────────────────────────────── */}
              {explanation && (
                <>
                  <Separator className="bg-[#2a2a2a]" />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-[#C7AE6A]" aria-hidden="true" />
                      <h3 className="text-xs font-black text-white uppercase tracking-widest">Why it moved</h3>
                    </div>
                    <p
                      className="text-sm text-[#9a9a9a] leading-relaxed border-l-2 border-[#C7AE6A] pl-4 italic"
                      data-testid="movement-context-panel"
                    >
                      {explanation}
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* ─── Footer bar ─────────────────────────────────────────────── */}
        <div className="px-6 py-4 border-t border-[#1a1a1a] bg-[#0c0c0c] shrink-0 flex items-center justify-between">
          <button
            onClick={() => setLocation('/pulse/overview')}
            className="flex items-center gap-1.5 text-sm text-[#6b6b6b] hover:text-[#DDD5C3] transition-colors"
            aria-label="Back to Pulse overview"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to overview
          </button>
          <span className="text-[9px] text-[#2a2a2a] font-black uppercase tracking-[0.3em]">
            GOLDH · Pulse v2
          </span>
        </div>
      </div>

      {/* Backdrop for mobile */}
      <div
        className="fixed inset-0 bg-black/60 z-40 md:hidden"
        onClick={() => setLocation('/pulse/overview')}
        aria-hidden="true"
      />
    </>
  );
}
