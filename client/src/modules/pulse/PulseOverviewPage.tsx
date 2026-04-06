import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  GripVertical,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useLocation, useRoute } from 'wouter';
import { AppLayout } from '@/components/AppLayout';
import MorningPulseHero from './components/MorningPulseHero';
import PulseAssetTable from './components/PulseAssetTable';
import { AlertsBell } from './components/AlertsBell';
import { AlertsManager } from './components/AlertsManager';
import PulseAssetDetailPanel from './components/PulseAssetDetailPanel';
import { usePulseOverview } from './hooks/usePulseOverview';
import { PULSE_ASSET_CLASSES, ASSET_CLASS_LABELS } from './types';
import { useUserPreferences } from '@/lib/userPreferences';
import { PageHeader } from '@/components/shared/PageHeader';
import { useDebounce } from '@/hooks/useDebounce';
import { Activity } from 'lucide-react';

/* ─── helpers ─────────────────────────────────────────────────────────────── */
function cn(...c: unknown[]) { return (c.filter(Boolean) as string[]).join(' '); }

/* ─── component ────────────────────────────────────────────────────────────── */
export default function PulseOverviewPage() {
  const { data: overview, isLoading, error } = usePulseOverview();

  const tier = overview?.tier ?? 'free';
  const degraded = overview?.degraded ?? false;
  const sourceUi = overview?.sourceUi ?? 'Empty';
  const assetGroups = overview?.data?.assetGroups ?? {};
  const triggeredAlerts = overview?.triggeredAlerts ?? [];

  // Section order and visibility — backed by server-persisted user preferences
  const { preferences, updatePreferences } = useUserPreferences();
  const sectionOrder = preferences.sectionOrder;
  const sectionVisible = useMemo(
    () => Object.fromEntries(PULSE_ASSET_CLASSES.map((c) => [c, !preferences.hiddenSections.includes(c)])),
    [preferences.hiddenSections]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  const [match, params] = useRoute('/features/pulse/asset/:symbol');
  const [, setLocation] = useLocation();

  // Sync selection with URL
  useEffect(() => {
    if (match && params?.symbol) {
      setSelectedSymbol(params.symbol.toUpperCase());
    } else {
      setSelectedSymbol(null);
    }
  }, [match, params?.symbol]);

  const handleSelectAsset = (symbol: string | null) => {
    if (symbol) {
      setLocation(`/features/pulse/asset/${symbol.toLowerCase()}`);
    } else {
      setLocation('/features/pulse');
    }
  };

  /* ─── computed ─────────────────────────────────────────────────────────── */
  const totalAssets = useMemo(
    () => Object.values(assetGroups).reduce((sum, arr) => sum + arr.length, 0),
    [assetGroups]
  );

  const totalClasses = useMemo(
    () => Object.values(assetGroups).filter((arr) => arr.length > 0).length,
    [assetGroups]
  );

  // Flatten all assets for hero stats
  const allAssets = useMemo(() => Object.values(assetGroups).flat(), [assetGroups]);

  const topMover = useMemo(() => {
    const withChange = allAssets.filter((a) => a.percentChange24h != null);
    if (!withChange.length) return undefined;
    const sorted = [...withChange].sort((a, b) => (b.percentChange24h ?? 0) - (a.percentChange24h ?? 0));
    const best = sorted[0];
    if (!best) return undefined;
    const ch = best.percentChange24h ?? 0;
    return {
      symbol: best.symbol,
      change: `${ch >= 0 ? '+' : ''}${ch.toFixed(2)}%`,
      positive: ch >= 0,
    };
  }, [allAssets]);

  const worstPerformer = useMemo(() => {
    const withChange = allAssets.filter((a) => a.percentChange24h != null);
    if (!withChange.length) return undefined;
    const sorted = [...withChange].sort((a, b) => (a.percentChange24h ?? 0) - (b.percentChange24h ?? 0));
    const worst = sorted[0];
    if (!worst) return undefined;
    const ch = worst.percentChange24h ?? 0;
    return {
      symbol: worst.symbol,
      change: `${ch >= 0 ? '+' : ''}${ch.toFixed(2)}%`,
    };
  }, [allAssets]);

  // Filtered sections
  const filteredSections = useMemo(() => {
    return sectionOrder
      .filter((cls) => sectionVisible[cls])
      .map((cls) => {
        const raw = assetGroups[cls] ?? [];
        const filtered = debouncedSearchQuery
          ? raw.filter(
            (a) =>
              a.symbol.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
              a.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
          )
          : raw;
        return { cls, label: ASSET_CLASS_LABELS[cls as keyof typeof ASSET_CLASS_LABELS] ?? cls, assets: filtered };
      })
      .filter((g) => g.assets.length > 0 || !debouncedSearchQuery);
  }, [sectionOrder, sectionVisible, assetGroups, debouncedSearchQuery]);

  /* ─── section manager ──────────────────────────────────────────────────── */
  const moveSectionUp = useCallback((i: number) => {
    if (i === 0) return;
    const n = [...sectionOrder];
    [n[i - 1], n[i]] = [n[i], n[i - 1]];
    updatePreferences({ sectionOrder: n });
  }, [sectionOrder, updatePreferences]);

  const moveSectionDown = useCallback((i: number) => {
    if (i === sectionOrder.length - 1) return;
    const n = [...sectionOrder];
    [n[i + 1], n[i]] = [n[i], n[i + 1]];
    updatePreferences({ sectionOrder: n });
  }, [sectionOrder, updatePreferences]);

  const toggleSectionVis = useCallback((cls: string) => {
    const isHidden = preferences.hiddenSections.includes(cls);
    const next = isHidden
      ? preferences.hiddenSections.filter((h) => h !== cls)
      : [...preferences.hiddenSections, cls];
    updatePreferences({ hiddenSections: next });
  }, [preferences.hiddenSections, updatePreferences]);

  return (
    <AppLayout title="Pulse">
      <main
        className="container mx-auto px-4 sm:px-6 pt-6 pb-12 max-w-7xl"
        data-testid="pulse-overview-page"
      >
        <div className="space-y-6 animate-in fade-in duration-700 relative">


          {/* ─── Morning Pulse Hero ───────────────────────────────────────── */}
          {!error && (
            <MorningPulseHero
              topMover={topMover}
              worstPerformer={worstPerformer}
              totalAssets={totalAssets}
              totalClasses={totalClasses}
            />
          )}

          {/* ─── Degraded banner ─────────────────────────────────────────── */}
          {degraded && (
            <div
              role="alert"
              data-testid="degraded-banner"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 text-sm"
            >
              <AlertTriangle size={14} className="shrink-0" aria-hidden="true" />
              <span>Live data partially degraded. Fallback providers in use.</span>
            </div>
          )}

          {/* ─── Error state ─────────────────────────────────────────────── */}
          {error && (
            <div
              role="alert"
              className="flex flex-col items-center justify-center py-16 text-center"
              data-testid="pulse-error"
            >
              <AlertTriangle size={32} className="text-[#6b6b6b] mb-3" />
              <p className="text-[#DDD5C3] font-medium mb-1">Unable to load market data</p>
              <p className="text-[#6b6b6b] text-sm">{error.message}</p>
            </div>
          )}

          {/* ─── Toolbar ─────────────────────────────────────────────────── */}
          {!error && (
            <div className="relative">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-2 border-b border-[#1a1a1a]">
                {/* Search */}
                <div className="relative w-full md:w-96 group">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#4a4a4a] group-focus-within:text-[#C7AE6A] transition-colors" aria-hidden="true" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, ID, keyword"
                    className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl text-sm text-white pl-10 pr-4 h-10 w-full focus:ring-1 focus:ring-[#C7AE6A]/50 placeholder:text-[#4a4a4a] font-medium transition-all outline-none"
                    aria-label="Search assets"
                  />
                </div>

                <div className="flex items-center gap-3">
                  {/* Source badge */}
                  {!isLoading && !error && overview?.data?.timestamp_utc && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#6b6b6b]" aria-live="polite">
                        {new Date(overview.data.timestamp_utc).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          timeZoneName: 'short',
                        })}
                      </span>
                      <span
                        className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-widest',
                          sourceUi === 'Live'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                            : sourceUi === 'Firestore'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/25'
                              : 'bg-[#C7AE6A]/10 text-[#C7AE6A] border-[#C7AE6A]/25'
                        )}
                      >
                        {sourceUi}
                      </span>
                    </div>
                  )}

                  {/* Alerts bell */}
                  <AlertsBell
                    tier={tier}
                    triggeredCount={triggeredAlerts.length}
                    onClick={() => setShowAlerts(true)}
                  />

                  {/* Sections button */}
                  {tier !== 'free' && (
                    <button
                      onClick={() => setShowConfig(!showConfig)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all',
                        showConfig
                          ? 'bg-[#C7AE6A] text-black border-transparent shadow-[0_0_15px_rgba(199,174,106,0.3)]'
                          : 'bg-[#C7AE6A]/5 border-[#C7AE6A]/20 text-[#C7AE6A] hover:bg-[#C7AE6A]/10'
                      )}
                      aria-label="Toggle sections configuration"
                    >
                      <GripVertical className="w-3 h-3" aria-hidden="true" />
                      Sections
                    </button>
                  )}
                </div>
              </div>

              {/* ─── Section Manager ────────────────────────────────────── */}
              {showConfig && (
                <div className="absolute right-0 top-full mt-2 z-30 bg-[#0a0a0a] border border-[#C7AE6A]/30 rounded-xl p-4 md:p-6 shadow-2xl animate-in zoom-in-95 duration-200 space-y-4 w-full md:max-w-md">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Section manager</h4>
                    <button
                      onClick={() => setShowConfig(false)}
                      className="text-[#4a4a4a] hover:text-white"
                      aria-label="Close section manager"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {sectionOrder.map((cls, i) => {
                      const count = assetGroups[cls]?.length ?? 0;
                      const visible = sectionVisible[cls];
                      return (
                        <div key={cls} className="flex items-center justify-between p-3 bg-[#050505] border border-[#1a1a1a] rounded-lg">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleSectionVis(cls)}
                              className="text-[#4a4a4a] hover:text-white transition-colors"
                              aria-label={visible ? `Hide ${ASSET_CLASS_LABELS[cls as keyof typeof ASSET_CLASS_LABELS]}` : `Show ${ASSET_CLASS_LABELS[cls as keyof typeof ASSET_CLASS_LABELS]}`}
                            >
                              {visible
                                ? <Eye className="w-4 h-4 text-[#C7AE6A]" aria-hidden="true" />
                                : <EyeOff className="w-4 h-4" aria-hidden="true" />
                              }
                            </button>
                            <span className={cn('text-xs font-bold', visible ? 'text-white' : 'text-[#4a4a4a]')}>
                              {ASSET_CLASS_LABELS[cls as keyof typeof ASSET_CLASS_LABELS] ?? cls}
                            </span>
                            <span className="text-[9px] text-[#4a4a4a] font-bold">({count})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => moveSectionUp(i)}
                              disabled={i === 0}
                              className="p-1 hover:bg-[#1a1a1a] rounded text-[#4a4a4a] hover:text-white transition-colors disabled:opacity-20"
                              aria-label="Move section up"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => moveSectionDown(i)}
                              disabled={i === sectionOrder.length - 1}
                              className="p-1 hover:bg-[#1a1a1a] rounded text-[#4a4a4a] hover:text-white transition-colors disabled:opacity-20"
                              aria-label="Move section down"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── Asset Sections ──────────────────────────────────────────── */}
          {!error && (
            <div className="space-y-10" data-testid="asset-class-sections">
              {filteredSections.map(({ cls, label, assets }) => {
                return (
                  <section
                    key={cls}
                    className="space-y-4 animate-in slide-in-from-left-2 duration-500"
                    aria-label={`${label} assets`}
                    data-testid={`section-${cls}`}
                  >
                    {/* Section header */}
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-5 bg-[#C7AE6A] rounded-full shadow-[0_0_8px_rgba(199,174,106,0.3)]" aria-hidden="true" />
                      <h2 className="text-base font-bold text-white tracking-tight">{label}</h2>
                      <span className="text-[10px] bg-[#1a1a1a] text-[#4a4a4a] px-1.5 py-0.5 rounded-md font-bold">
                        {assets.length}
                      </span>
                    </div>

                    {/* Table */}
                    <PulseAssetTable
                      assets={assets}
                      tier={tier}
                      isLoading={isLoading}
                      selectedSymbol={selectedSymbol}
                      onSelectAsset={handleSelectAsset}
                      onOpenAlerts={() => setShowAlerts(true)}
                    />
                  </section>
                );
              })}

              {filteredSections.length === 0 && !isLoading && (
                <div className="text-center py-16 text-[#4a4a4a] text-sm">
                  No assets match your search.
                </div>
              )}
            </div>
          )}

          {/* Asset Detail Overlay */}
          {selectedSymbol && (
            <>
              <PulseAssetDetailPanel
                symbol={selectedSymbol}
                onClose={() => handleSelectAsset(null)}
              />
              <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-300"
                onClick={() => handleSelectAsset(null)}
                aria-hidden="true"
              />
            </>
          )}
        </div>
      </main>

      {/* ─── Alerts Manager (Sheet drawer) ───────────────────────────────── */}
      <AlertsManager
        open={showAlerts}
        onOpenChange={setShowAlerts}
        tier={tier}
        triggeredAlerts={triggeredAlerts}
      />
    </AppLayout>
  );
}
