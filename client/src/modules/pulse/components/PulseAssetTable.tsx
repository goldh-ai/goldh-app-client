import { memo, useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, Bell } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertsBellPlaceholder } from './AlertsBellPlaceholder';
import ConfidenceBadge from './ConfidenceBadge';
import { STREETScoreChip } from './STREETScoreChip';
import type { PulseAsset, SortKey, SortDir } from '../types';
import { useLocation } from 'wouter';

interface PulseAssetTableProps {
  assets: PulseAsset[];
  isLoading?: boolean;
  tier: string;
  /** Whether to initially show all rows or just 5 */
  initialExpanded?: boolean;
  selectedSymbol?: string | null;
  onSelectAsset: (symbol: string) => void;
  onOpenAlerts?: () => void;
}

const INITIAL_ROW_COUNT = 5;

function deriveSpark(price: number | null, change24h: number | null, existing?: number[]): number[] {
  if (existing && existing.length >= 2) return existing;
  return [];
}

function sparkPath(pts: number[]): string {
  if (!pts.length) return '';
  const max = Math.max(...pts), min = Math.min(...pts), h = 28, w = 80;
  return pts.map((p, i) => {
    const x = (i / (pts.length - 1)) * w;
    const y = h - ((p - min) / (max - min || 1)) * h;
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
}

function formatPrice(price: number | null): string {
  if (price == null) return '—';
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatVolume(volume: number | null): string {
  if (volume == null) return '—';
  if (volume >= 1_000_000_000) return `$${(volume / 1_000_000_000).toFixed(1)}B`;
  if (volume >= 1_000_000) return `$${(volume / 1_000_000).toFixed(1)}M`;
  if (volume >= 1_000) return `$${(volume / 1_000).toFixed(1)}K`;
  return `$${volume.toLocaleString()}`;
}

function cn(...c: unknown[]) { return (c.filter(Boolean) as string[]).join(' '); }

// ─── Row ─────────────────────────────────────────────────────────────────────

interface RowProps {
  asset: PulseAsset;
  isSelected: boolean;
  tier: string;
  onSelectAsset: (symbol: string) => void;
  onOpenAlerts?: () => void;
}

const AssetRow = memo(function AssetRow({ asset, isSelected, tier, onSelectAsset, onOpenAlerts }: RowProps) {
  // Removed: const [, setLocation] = useLocation();
  const isPositive = (asset.percentChange24h ?? 0) >= 0;
  const isFlat = asset.percentChange24h == null || asset.percentChange24h === 0;
  const sparkPts = deriveSpark(asset.price, asset.percentChange24h, asset.sparkline7d);
  // Sparkline color tracks the 7-day trend, not the 24h change
  const spark7dPositive = asset.sevenDayChange != null ? asset.sevenDayChange >= 0 : isPositive;
  const spark7dFlat = asset.sevenDayChange == null || asset.sevenDayChange === 0;
  const sparkColor = spark7dFlat ? '#4a4a4a' : spark7dPositive ? '#10b981' : '#ef4444';

  const handleClick = () => {
    onSelectAsset(asset.symbol);
  };

  return (
    <tr
      className={cn(
        'transition-colors cursor-pointer group h-[52px]',
        isSelected
          ? 'bg-[#C7AE6A]/10 border-l-2 border-[#C7AE6A]'
          : 'hover:bg-[#121212]'
      )}
      onClick={handleClick}
      tabIndex={0}
      role="row"
      aria-label={`View details for ${asset.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      data-testid={`asset-row-${asset.symbol}`}
    >
      {/* Asset — sticky */}
      <td className="px-5 py-0 sticky left-0 bg-[#0a0a0a] group-hover:bg-[#121212] transition-colors z-20 border-r border-[#222]/50 md:border-none">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white group-hover:text-[#C7AE6A] transition-colors">
            {asset.symbol}
          </span>
          <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest truncate max-w-[60px] md:max-w-[140px]">
            | {asset.name}
          </span>
          <STREETScoreChip ticker={asset.symbol} assetClass={asset.assetClass} tier={tier} />
        </div>
      </td>

      {/* Price */}
      <td className="px-4 py-0 text-right">
        <span className="text-sm font-bold text-gray-300 font-mono tracking-tight">
          {formatPrice(asset.price)}
        </span>
      </td>

      {/* 7D Trend sparkline — hidden on <lg */}
      <td className="px-4 py-0 text-center hidden lg:table-cell">
        <svg width="80" height="28" className="inline-block" aria-hidden="true">
          <path
            d={sparkPath(sparkPts)}
            fill="none"
            stroke={sparkColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </td>

      {/* 24h % */}
      <td className="px-4 py-0 text-right">
        {asset.percentChange24h == null ? (
          <span className="text-[11px] font-mono text-[#6b6b6b] font-bold">—</span>
        ) : (
          <div className={cn(
            'inline-flex items-center gap-1 font-mono text-[11px] font-bold px-1.5 py-0.5 rounded',
            isFlat
              ? 'text-[#6b6b6b]'
              : isPositive
                ? 'text-emerald-500 bg-emerald-500/5'
                : 'text-red-500 bg-red-500/5'
          )}>
            {!isFlat && (isPositive
              ? <TrendingUp className="w-3 h-3" aria-hidden="true" />
              : <TrendingDown className="w-3 h-3" aria-hidden="true" />
            )}
            {isPositive && !isFlat ? '+' : ''}
            {asset.percentChange24h.toFixed(2)}%
          </div>
        )}
      </td>

      {/* 7d % */}
      <td className="px-4 py-0 text-right hidden sm:table-cell">
        {asset.sevenDayChange == null ? (
          <span className="text-[11px] font-mono text-[#6b6b6b] font-bold">—</span>
        ) : (
          <span className={cn(
            'inline-flex items-center font-mono text-[11px] font-bold px-1.5 py-0.5 rounded',
            asset.sevenDayChange === 0
              ? 'text-[#6b6b6b]'
              : asset.sevenDayChange > 0
                ? 'text-emerald-500 bg-emerald-500/5'
                : 'text-red-500 bg-red-500/5'
          )}>
            {asset.sevenDayChange > 0 ? '+' : ''}{asset.sevenDayChange.toFixed(1)}%
          </span>
        )}
      </td>

      {/* Volume — hidden on <xl */}
      <td className="px-4 py-0 text-right hidden xl:table-cell">
        <span className="text-[11px] font-mono text-[#6b6b6b] font-bold">
          {formatVolume(asset.volume24h)}
        </span>
      </td>

      {/* Trust/Confidence */}
      <td className="px-4 py-0 text-center hidden md:table-cell">
        <ConfidenceBadge
          confidenceScore={asset.confidenceScore}
          confidenceBadge={asset.confidenceBadge}
        />
      </td>

      {/* Alert bell */}
      <td
        className="px-4 py-0 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onOpenAlerts}
          className="relative inline-flex items-center justify-center w-7 h-7 rounded-md text-[#6b6b6b] hover:text-[#C7AE6A] transition-colors focus:outline-none"
          aria-label={`Manage alerts for ${asset.symbol}`}
        >
          <Bell size={15} />
        </button>
      </td>
    </tr>
  );
});

// ─── Table ────────────────────────────────────────────────────────────────────

function PulseAssetTableInner({
  assets,
  isLoading = false,
  tier,
  initialExpanded = false,
  selectedSymbol,
  onSelectAsset,
  onOpenAlerts,
}: PulseAssetTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('symbol');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [expanded, setExpanded] = useState(initialExpanded);
  // Removed: const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const sortedAssets = useMemo(() => {
    return [...assets].sort((a, b) => {
      if (sortKey === 'symbol') {
        const aVal = a.symbol.toLowerCase();
        const bVal = b.symbol.toLowerCase();
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      const aVal = (a[sortKey] as number | null) ?? -Infinity;
      const bVal = (b[sortKey] as number | null) ?? -Infinity;
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [assets, sortKey, sortDir]);

  const visibleAssets = expanded ? sortedAssets : sortedAssets.slice(0, INITIAL_ROW_COUNT);
  const hiddenCount = sortedAssets.length - INITIAL_ROW_COUNT;

  if (isLoading) {
    return (
      <div className="space-y-2" aria-busy="true" aria-label="Loading assets">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[52px] w-full bg-[#1a1a1a] rounded-lg" />
        ))}
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="text-center py-10 bg-[#0c0c0c]/50 border border-[#222] rounded-2xl">
        <p className="text-[#6b6b6b] text-sm mb-4">No assets available for this class.</p>
        <button
          onClick={() => {
            // This assumes the parent handles the search clearing, 
            // but we can at least show the button to guide the user.
            const searchInput = document.querySelector('input[aria-label="Search assets"]') as HTMLInputElement;
            if (searchInput) {
              searchInput.value = '';
              searchInput.dispatchEvent(new Event('input', { bubbles: true }));
              searchInput.focus();
            }
          }}
          className="text-[10px] font-black uppercase tracking-widest text-[#C7AE6A] hover:underline"
        >
          Clear Search
        </button>
      </div>
    );
  }

  const SortIcon = ({ col }: { col: SortKey }) => {
    const active = sortKey === col;
    return active && sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 inline ml-1 text-[#C7AE6A]" />
      : <ChevronDown className="w-3 h-3 inline ml-1 text-[#4a4a4a]" />;
  };

  return (
    <div className="bg-[#111111]/40 backdrop-blur-xl border border-[#222] rounded-2xl overflow-hidden glass-morphism shadow-2xl">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left min-w-[1000px] border-collapse relative">
          <thead className="text-xs font-black text-gray-500 uppercase tracking-[0.15em] bg-[#0c0c0c] border-b border-[#222]">
            <tr>
              <th
                className="px-5 py-3.5 font-medium w-[150px] md:w-[220px] sticky left-0 bg-[#0c0c0c] z-30 border-r border-[#222]/50 md:border-none cursor-pointer hover:text-[#DDD5C3] transition-colors select-none"
                onClick={() => handleSort('symbol')}
                aria-sort={sortKey === 'symbol' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                Asset <SortIcon col="symbol" />
              </th>
              <th
                className="px-4 py-3.5 text-right font-medium cursor-pointer hover:text-[#DDD5C3] transition-colors select-none"
                onClick={() => handleSort('price')}
                aria-sort={sortKey === 'price' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                Price <SortIcon col="price" />
              </th>
              <th className="px-4 py-3.5 text-center font-medium w-[100px] hidden lg:table-cell">
                7D Trend
              </th>
              <th
                className="px-4 py-3.5 text-right font-medium cursor-pointer hover:text-[#DDD5C3] transition-colors select-none"
                onClick={() => handleSort('percentChange24h')}
                aria-sort={sortKey === 'percentChange24h' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                24h <SortIcon col="percentChange24h" />
              </th>
              <th className="px-4 py-3.5 text-right font-medium hidden sm:table-cell">
                7d
              </th>
              <th
                className="px-4 py-3.5 text-right font-medium cursor-pointer hover:text-[#DDD5C3] transition-colors select-none hidden xl:table-cell"
                onClick={() => handleSort('volume24h')}
                aria-sort={sortKey === 'volume24h' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                24H Volume <SortIcon col="volume24h" />
              </th>
              <th className="px-4 py-3.5 text-center font-medium hidden md:table-cell">
                Trust
              </th>
              <th className="px-4 py-3.5 text-center font-medium w-[50px]">
                <Bell className="w-3 h-3 inline" aria-hidden="true" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]/60">
            {visibleAssets.map((asset) => (
              <AssetRow
                key={asset.symbol}
                asset={asset}
                isSelected={selectedSymbol === asset.symbol}
                onSelectAsset={onSelectAsset}
                tier={tier}
                onOpenAlerts={onOpenAlerts}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden divide-y divide-[#1a1a1a]/60">
        {visibleAssets.map((asset) => {
          const isPositive = (asset.percentChange24h ?? 0) >= 0;
          return (
            <div
              key={asset.symbol}
              className={cn(
                "p-4 space-y-3 cursor-pointer transition-colors",
                selectedSymbol === asset.symbol ? "bg-[#C7AE6A]/10" : "hover:bg-[#121212]"
              )}
              onClick={() => onSelectAsset(asset.symbol)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{asset.symbol}</span>
                  <span className="text-[10px] text-gray-600 font-bold uppercase truncate max-w-[120px]">
                    {asset.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-300 font-mono">
                    {formatPrice(asset.price)}
                  </div>
                  {asset.percentChange24h != null && (
                    <div className={cn(
                      "text-[11px] font-mono font-bold",
                      asset.percentChange24h >= 0 ? "text-emerald-500" : "text-red-500"
                    )}>
                      {asset.percentChange24h >= 0 ? '+' : ''}{asset.percentChange24h.toFixed(2)}%
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <ConfidenceBadge
                  confidenceScore={asset.confidenceScore}
                  confidenceBadge={asset.confidenceBadge}
                />
                <div
                  className="flex items-center gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  {asset.volume24h != null && (
                    <span className="text-[10px] text-[#4a4a4a] font-bold">
                      Vol: {formatVolume(asset.volume24h)}
                    </span>
                  )}
                  <button
                    onClick={onOpenAlerts}
                    className="relative inline-flex items-center justify-center w-7 h-7 rounded-md text-[#6b6b6b] hover:text-[#C7AE6A] transition-colors focus:outline-none"
                    aria-label={`Manage alerts for ${asset.symbol}`}
                  >
                    <Bell size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show More / Show Less */}
      {hiddenCount > 0 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#0c0c0c]/50 hover:bg-[#121212] border-t border-[#222] text-xs text-gray-500 hover:text-[#C7AE6A] font-black uppercase tracking-widest transition-all group"
          data-testid="expand-table-btn"
        >
          {expanded ? (
            <>Show Less <ChevronUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" /></>
          ) : (
            <>Show {hiddenCount} more assets <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" /></>
          )}
        </button>
      )}
    </div>
  );
}

const PulseAssetTable = memo(PulseAssetTableInner);
export default PulseAssetTable;
