import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/auth';
import { AppLayout } from '@/components/AppLayout';
import { useSTREETScoreUniverse } from '../hooks/useSTREETScoreUniverse';
import { STREETScoreHero } from '../components/STREETScoreHero';
import { FilterBar } from '../components/FilterBar';
import { ScoreRow } from '../components/ScoreRow';
import { TierGate } from '../components/TierGate';
import { PageHeader } from '@/components/shared/PageHeader';
import { PaginationBar } from '@/components/shared/PaginationBar';
import { ActiveFilterChips, type FilterChip } from '@/components/shared/ActiveFilterChips';
import { BarChart3 } from 'lucide-react';

const PAGE_SIZE = 50;

function isPro(tier: string | undefined) {
  return ['pro', 'elite', 'admin'].includes(tier ?? '');
}

export default function STREETScorePage() {
  const { user } = useAuth();
  const proAccess = isPro(user?.planTier);

  const [sector, setSector] = useState('');
  const [grade, setGrade] = useState('');
  const [signalState, setSignalState] = useState('');
  const [confidenceBand, setConfidenceBand] = useState('');
  const [sortBy, setSortBy] = useState('score_desc');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useSTREETScoreUniverse(
    proAccess
      ? { sector, grade, signalState, confidenceBand, sortBy, page, pageSize: PAGE_SIZE }
      : {}
  );

  const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE);

  // Active filter chips
  const activeFilters: FilterChip[] = [
    ...(sector ? [{ label: 'Sector', value: sector, onRemove: () => { setSector(''); setPage(1); } }] : []),
    ...(grade ? [{ label: 'Grade', value: grade, onRemove: () => { setGrade(''); setPage(1); } }] : []),
    ...(signalState ? [{ label: 'Signal', value: signalState.replace(/_/g, ' '), onRemove: () => { setSignalState(''); setPage(1); } }] : []),
    ...(confidenceBand ? [{ label: 'Confidence', value: confidenceBand, onRemove: () => { setConfidenceBand(''); setPage(1); } }] : []),
  ];

  function clearAllFilters() {
    setSector(''); setGrade(''); setSignalState(''); setConfidenceBand(''); setPage(1);
  }

  // Pre-built views (client-side from loaded page)
  const topPicks = (data?.entries ?? [])
    .filter(e => (e.streetScore ?? 0) >= 80 && ['strong_bullish', 'bullish_improving'].includes(e.signalState ?? ''))
    .slice(0, 20);

  const momentumLeaders = (data?.entries ?? [])
    .filter(e => ['bullish_improving', 'neutral_improving'].includes(e.signalState ?? ''))
    .slice(0, 20);

  const scoreTableHeader = (
    <div className="flex items-center gap-4 px-3 py-2.5 bg-[#111] text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-[#222]">
      <div className="w-28">Ticker</div>
      <div className="w-16 text-center">Score</div>
      <div className="w-10 text-center">Grade</div>
      <div className="flex-1">Signal</div>
      <div className="w-20 text-right">Target</div>
      <div className="w-12 text-center">7d</div>
    </div>
  );

  return (
    <AppLayout title="STREETScore">
      <main className="container mx-auto px-4 sm:px-6 pt-6 pb-12 max-w-7xl">
      <PageHeader
        label="Analyst Consensus Engine"
        title="STREETScore"
        description={`Analyst consensus score (0–100), A–F grade, and signal across ${data?.total ?? 380} tickers`}
        icon={<BarChart3 className="h-6 w-6" />}
      />

      {!proAccess ? (
        <TierGate />
      ) : (
        <>
          {data && (
            <STREETScoreHero total={data.total} entries={data.entries} />
          )}

          <Tabs defaultValue="universe">
            <TabsList className="bg-[#0a0a0a] border border-[#222] mb-4">
              <TabsTrigger value="universe" className="data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-[#C7AE6A] text-xs">
                Universe
              </TabsTrigger>
              <TabsTrigger value="top-picks" className="data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-[#C7AE6A] text-xs">
                Top Picks
              </TabsTrigger>
              <TabsTrigger value="momentum" className="data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-[#C7AE6A] text-xs">
                Momentum Leaders
              </TabsTrigger>
            </TabsList>

            <TabsContent value="universe">
              <FilterBar
                sector={sector} grade={grade} signalState={signalState} confidenceBand={confidenceBand} sortBy={sortBy}
                onSectorChange={v => { setSector(v); setPage(1); }}
                onGradeChange={v => { setGrade(v); setPage(1); }}
                onSignalChange={v => { setSignalState(v); setPage(1); }}
                onConfidenceChange={v => { setConfidenceBand(v); setPage(1); }}
                onSortChange={v => { setSortBy(v); setPage(1); }}
              />

              <ActiveFilterChips filters={activeFilters} onClearAll={activeFilters.length > 1 ? clearAllFilters : undefined} />

              {isLoading && (
                <div className="space-y-2 mt-2">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="h-12 bg-[#0a0a0a] border border-[#1a1a1a] rounded animate-pulse" />
                  ))}
                </div>
              )}
              {error && (
                <div className="text-center py-12 text-rose-400 text-sm">
                  {(error as Error).message === 'STREETSCORE_ACCESS_DENIED'
                    ? 'Upgrade to PRO to access STREETScore.'
                    : 'Failed to load scores. Please try again.'}
                </div>
              )}

              {data && !isLoading && (
                <>
                  <div className="rounded-xl border border-[#222] overflow-hidden">
                    {scoreTableHeader}
                    {data.entries.map(entry => <ScoreRow key={entry.ticker} entry={entry} />)}
                    {data.entries.length === 0 && (
                      <div className="text-center py-12 text-gray-500 text-sm">No tickers match these filters.</div>
                    )}
                  </div>

                  {data.total > PAGE_SIZE && (
                    <PaginationBar
                      page={page}
                      totalPages={totalPages}
                      totalItems={data.total}
                      startIndex={(page - 1) * PAGE_SIZE}
                      endIndex={Math.min(page * PAGE_SIZE, data.total)}
                      onPrev={() => setPage(p => Math.max(1, p - 1))}
                      onNext={() => setPage(p => Math.min(totalPages, p + 1))}
                      onPageSelect={setPage}
                    />
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="top-picks">
              <p className="text-xs text-gray-500 mb-3">Score ≥ 80 with Strong Street or warming up signal — top 20</p>
              <div className="rounded-xl border border-[#222] overflow-hidden">
                {scoreTableHeader}
                {topPicks.map(entry => <ScoreRow key={entry.ticker} entry={entry} />)}
                {topPicks.length === 0 && !isLoading && (
                  <div className="text-center py-12 text-gray-500 text-sm">No top picks at this time.</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="momentum">
              <p className="text-xs text-gray-500 mb-3">Tickers with improving analyst momentum — top 20</p>
              <div className="rounded-xl border border-[#222] overflow-hidden">
                {scoreTableHeader}
                {momentumLeaders.map(entry => <ScoreRow key={entry.ticker} entry={entry} />)}
                {momentumLeaders.length === 0 && !isLoading && (
                  <div className="text-center py-12 text-gray-500 text-sm">No momentum leaders at this time.</div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
      </main>
    </AppLayout>
  );
}
