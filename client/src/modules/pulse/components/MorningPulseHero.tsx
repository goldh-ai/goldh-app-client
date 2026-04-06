import { useState } from 'react';
import { ChevronDown, ChevronRight, Sparkles, TrendingUp, TrendingDown, Waves, CalendarClock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useMorningBrief } from '../hooks/useMorningBrief';
import { useWhaleNetflow } from '@/modules/whale/hooks/useWhaleNetflow';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

interface MorningPulseHeroProps {
  topMover?: { symbol: string; change: string; positive: boolean };
  worstPerformer?: { symbol: string; change: string };
  totalAssets?: number;
  totalClasses?: number;
}

/** Returns the most recent Monday date as "Week of Mon DD" label. */
function weekOfLabel(dateFor: string): string {
  const d = new Date(dateFor + 'T00:00:00Z');
  const day = d.getUTCDay(); // 0=Sun, 6=Sat
  const diff = day === 0 ? -6 : 1 - day; // offset to Monday
  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() + diff);
  return `Week of ${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}`;
}

export default function MorningPulseHero({
  topMover,
  worstPerformer,
  totalAssets = 0,
  totalClasses = 0,
}: MorningPulseHeroProps) {
  const [expanded, setExpanded] = useState(true);
  const { user } = useAuth();
  const isEssentialOrAbove = ['essential', 'pro', 'elite', 'admin'].includes(user?.planTier ?? '');
  const { data: brief, isLoading } = useMorningBrief();
  const { data: btcFlow } = useWhaleNetflow('BTC', { enabled: isEssentialOrAbove });
  const { data: ethFlow } = useWhaleNetflow('ETH', { enabled: isEssentialOrAbove });

  const btcSpike = btcFlow?.crossModuleSignal === 'spike_detected' && btcFlow?.flowSpike;
  const ethSpike = ethFlow?.crossModuleSignal === 'spike_detected' && ethFlow?.flowSpike;

  const activeFlow = btcSpike ? btcFlow : (ethSpike ? ethFlow : null);
  const whaleSpike = !!activeFlow;

  const isWeekly = brief?.briefMode === 'weekly_recap';

  // Header label: "Weekly Brief · Week of Mar 17" vs "Morning Brief · Mar 21"
  const headerLabel = isWeekly ? 'Weekly Brief' : 'Morning Pulse';
  const dateLabel = brief?.dateFor
    ? isWeekly
      ? weekOfLabel(brief.dateFor)
      : new Date(brief.dateFor + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
    : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  // Mover chip period label: "Weekly" for recap, "24h" for daily
  const moverPeriodLabel = isWeekly ? 'Wk' : '24h';

  return (
    <div
      className="bg-gradient-to-r from-[#C7AE6A]/10 via-[#0a0a0a] to-[#0a0a0a] border border-[#C7AE6A]/30 rounded-2xl overflow-hidden shadow-2xl mb-6"
      data-testid="morning-pulse-hero"
    >
      <div className="p-6 md:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C7AE6A]" aria-hidden="true" />
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">
              {headerLabel}
            </h3>
            <span className="text-[10px] text-gray-500 font-medium normal-case tracking-normal">
              · {dateLabel}
            </span>
            {isWeekly && (
              <span className="ml-1 text-[9px] font-black text-[#C7AE6A] uppercase tracking-widest px-1.5 py-0.5 bg-[#C7AE6A]/10 border border-[#C7AE6A]/30 rounded">
                Recap
              </span>
            )}
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[#6b6b6b] hover:text-white transition-colors"
            aria-label={expanded ? 'Collapse brief' : 'Expand brief'}
          >
            {expanded
              ? <ChevronDown className="w-4 h-4" aria-hidden="true" />
              : <ChevronRight className="w-4 h-4" aria-hidden="true" />
            }
          </button>
        </div>

        {/* Headline */}
        {isLoading ? (
          <Skeleton className="h-8 w-3/4 bg-[#1a1a1a]" />
        ) : brief ? (
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            {brief.headline}
          </h2>
        ) : (
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            Multi-asset market snapshot &middot;{' '}
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </h2>
        )}

        {/* Top mover / weekly mover chips */}
        {!isLoading && brief && brief.topMovers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {brief.topMovers.map((mover) => (
              <div
                key={mover.symbol}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  mover.direction === 'up'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                {mover.direction === 'up'
                  ? <TrendingUp className="w-3 h-3" aria-hidden="true" />
                  : <TrendingDown className="w-3 h-3" aria-hidden="true" />
                }
                <span className="font-mono">{mover.symbol}</span>
                <span>
                  {mover.percentChange24h >= 0 ? '+' : ''}
                  {mover.percentChange24h.toFixed(2)}%
                </span>
                <span className="opacity-50 text-[9px]">{moverPeriodLabel}</span>
              </div>
            ))}
          </div>
        )}

        {/* Whale Activity badge — cross-module trigger, shown in both daily + weekly modes */}
        {whaleSpike && activeFlow && (
          <div className="flex items-center gap-3 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <Waves className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" aria-hidden="true" />
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                Whale Activity ({activeFlow.chain})
              </span>
              <span className="text-[10px] text-gray-400">
                Net Flow:{' '}
                <span className={cn(
                  'font-bold',
                  activeFlow.flowDirection === 'bullish' ? 'text-emerald-400' : 'text-rose-400'
                )}>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(Math.abs(activeFlow.netFlowUsd))}
                </span>
                {' '}| Baseline:{' '}
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(activeFlow.baseline7d)}
                {' '}|{' '}
                <span className={cn(
                  'font-bold uppercase',
                  activeFlow.flowDirection === 'bullish' ? 'text-emerald-400' : 'text-rose-400'
                )}>
                  {activeFlow.flowDirection}
                </span>
                {' '}|{' '}
                <span className="text-gray-500">{activeFlow.confidenceBand} confidence</span>
              </span>
            </div>
          </div>
        )}

        {expanded && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-500 space-y-4">
            {/* Summary paragraph */}
            {isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-[#1a1a1a]" />
                <Skeleton className="h-4 w-5/6 bg-[#1a1a1a]" />
              </div>
            )}
            {!isLoading && brief && brief.summary && (
              <p className="text-gray-400 text-base leading-relaxed">
                {brief.summary}
              </p>
            )}
            {!isLoading && !brief && (
              <p className="text-gray-400 text-base leading-relaxed">
                Real-time cross-asset intelligence across crypto, equities, commodities, FX, bonds and ETFs.
                No brief available yet.
              </p>
            )}

            {/* Regime badge — risk_on/risk_off/mixed/transition (R1) */}
            {!isLoading && brief?.regime && brief.regime !== 'neutral' && (() => {
              const regimeConfig: Record<string, { label: string; cls: string }> = {
                risk_off:   { label: 'Risk-Off',   cls: 'bg-red-500/10 border-red-500/30 text-red-400' },
                risk_on:    { label: 'Risk-On',    cls: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
                transition: { label: 'Transition', cls: 'bg-amber-500/10 border-amber-500/30 text-amber-400' },
                mixed:      { label: 'Mixed',      cls: 'bg-purple-500/10 border-purple-500/30 text-purple-400' },
              };
              const cfg = regimeConfig[brief.regime];
              if (!cfg) return null;
              return (
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${cfg.cls}`}>
                  {cfg.label}
                </span>
              );
            })()}

            {/* Watch Today — horizontal chips (bucket ≥80 = red, ≥40 = amber) */}
            {!isLoading && brief?.watchToday && brief.watchToday.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <div className="flex items-center gap-1 text-[10px] text-gray-500 font-black uppercase tracking-widest shrink-0">
                  <CalendarClock className="w-3 h-3" aria-hidden="true" />
                  <span>{isWeekly ? 'Watch Next Week' : 'Watch Today'}</span>
                </div>
                {brief.watchToday.map((event, i) => {
                  const time = event.scheduledTime.slice(11, 16);
                  const isHighImpact = event.bucket >= 80;
                  return (
                    <span
                      key={i}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                        isHighImpact
                          ? 'bg-red-500/10 border-red-500/30 text-red-400'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      }`}
                    >
                      {event.name.length > 20 ? event.name.slice(0, 20) + '…' : event.name}
                      <span className="opacity-60">{time} UTC</span>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Watch This Week — high-impact events in next 5 days (R5) */}
            {!isLoading && brief?.watchThisWeek && brief.watchThisWeek.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <div className="flex items-center gap-1 text-[10px] text-gray-500 font-black uppercase tracking-widest shrink-0">
                  <CalendarClock className="w-3 h-3" aria-hidden="true" />
                  <span>This Week</span>
                </div>
                {brief.watchThisWeek.map((event, i) => {
                  const d = new Date(event.scheduledTime);
                  const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
                  return (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border bg-red-500/10 border-red-500/30 text-red-400"
                    >
                      {event.name.length > 20 ? event.name.slice(0, 20) + '…' : event.name}
                      <span className="opacity-60">{dayLabel}</span>
                    </span>
                  );
                })}
              </div>
            )}

            {/* No Catalyst Mode — when no upcoming macro events (R5) */}
            {!isLoading && brief?.noCatalystMode && (
              <p className="text-[10px] text-gray-600 font-medium pt-1">
                No major macro catalysts — market driven by positioning and flows.
              </p>
            )}

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-[#1a1a1a]">
              <div className="space-y-1">
                <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest block">
                  {isWeekly ? 'Best of Week' : 'Top Mover'}
                </span>
                {topMover ? (
                  <span className={`text-lg font-bold font-mono ${topMover.positive ? 'text-emerald-500' : 'text-red-500'}`}>
                    {topMover.symbol} {topMover.change}
                  </span>
                ) : (
                  <span className="text-base font-bold font-mono text-[#6b6b6b]">—</span>
                )}
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest block">
                  {isWeekly ? 'Worst of Week' : 'Worst Performer'}
                </span>
                {worstPerformer ? (
                  <span className="text-lg font-bold font-mono text-red-500">
                    {worstPerformer.symbol} {worstPerformer.change}
                  </span>
                ) : (
                  <span className="text-base font-bold font-mono text-[#6b6b6b]">—</span>
                )}
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest block">
                  {isWeekly ? 'Week Ending' : 'Brief Date'}
                </span>
                <span className="text-sm font-bold font-mono text-[#C7AE6A]">
                  {dateLabel}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest block">
                  Assets Tracked
                </span>
                <span className="text-lg font-bold font-mono text-white">
                  {totalAssets}{' '}
                  <span className="text-gray-600 text-xs">
                    across {totalClasses} classes
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
