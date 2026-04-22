import { useCallback, useEffect, useMemo, useState } from "react";
import type { SortingState } from "@tanstack/react-table";
import type { PlanTier } from "@shared/types";
import { Trophy, WifiOff, UserRoundCheck } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { ActiveFilterChips, type FilterChip } from "@/components/shared/ActiveFilterChips";
import { BaseTable } from "@/components/shared/BaseTable";
import { NumberedPager } from "@/components/shared/NumberedPager";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import {
  collectActiveCopyTradeFilters,
  defaultCopyTradeFilterState,
  type CopyTradeFilterState,
} from "../lib/copyTradeFilters";
import {
  COPYTRADE_API_PAGE_SIZE,
  COPYTRADE_PER_PAGE_OPTIONS,
  type CopyTradePerPageOption,
} from "../lib/copyTradeConstants";
import { createCopyTradeColumns } from "../lib/createCopyTradeColumns";
import {
  COPYTRADE_DEFAULT_SORT_BY,
  copyTradeTableColumnIdForSortBy,
} from "../lib/copyTradeSort";
import { useCopyTradeTraders } from "../hooks/useCopyTradeTraders";
import {
  CopyTradeFiltersToolbar,
  CopyTradeMobileActions,
} from "../components/CopyTradeFiltersToolbar";
import { useCopyTradeTraderDetail } from "../hooks/useCopyTradeTraderDetail";
import { CopyTradeDetailPanel } from "../components/CopyTradeDetailPanel";

function normalizePlanTier(value: string | null | undefined): PlanTier | null {
  if (
    value === "free" ||
    value === "essential" ||
    value === "pro" ||
    value === "elite" ||
    value === "admin"
  ) {
    return value;
  }
  return null;
}

export default function CopyTradeLeaderboardPage() {
  const { user } = useAuth();
  const [grade, setGrade] = useState<string>("all");
  const [confidence, setConfidence] = useState<string>("all");
  const [signal, setSignal] = useState<string>("all");
  const [sortBy, setSortBy] = useState(COPYTRADE_DEFAULT_SORT_BY);
  const [perPage, setPerPage] = useState<number>(COPYTRADE_API_PAGE_SIZE);
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedTraderId, setSelectedTraderId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filterState: CopyTradeFilterState = useMemo(
    () => ({ grade, confidence, signal }),
    [grade, confidence, signal],
  );

  const { traders, totalAvailable, isLoading, isFetching, isError, error, refetch, mockEnabled } =
    useCopyTradeTraders({
      enabled: Boolean(user),
      grade,
      confidence,
      signal,
      sortBy,
      planTier: normalizePlanTier(user?.planTier),
    });

  const totalCount = traders.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / perPage));

  const clampedPageIndex = Math.min(pageIndex, pageCount - 1);
  const pagedRows = useMemo(() => {
    const start = clampedPageIndex * perPage;
    return traders.slice(start, start + perPage);
  }, [traders, clampedPageIndex, perPage]);

  const from = totalCount === 0 ? 0 : clampedPageIndex * perPage + 1;
  const to = Math.min((clampedPageIndex + 1) * perPage, totalCount);
  const selectedTrader = useMemo(
    () => traders.find((trader) => trader.traderId === selectedTraderId),
    [traders, selectedTraderId],
  );

  useEffect(() => {
    if (selectedTraderId) return;
    if (traders.length === 0) return;
    setSelectedTraderId(traders[0].traderId);
    setIsDetailOpen(true);
  }, [traders, selectedTraderId]);

  const {
    detail: selectedTraderDetail,
    isLoading: isDetailLoading,
    isError: isDetailError,
    error: detailError,
    refetch: refetchDetail,
    history30,
    history90,
    history30Error,
    history90Error,
  } = useCopyTradeTraderDetail({
    traderId: selectedTraderId,
    baseTrader: selectedTrader,
    enabled: Boolean(user),
  });

  const activeFilters: FilterChip[] = useMemo(
    () =>
      collectActiveCopyTradeFilters(filterState).map(({ field, label, value }) => ({
        label,
        value,
        onRemove: () => {
          if (field === "grade") setGrade("all");
          if (field === "confidence") setConfidence("all");
          if (field === "signal") setSignal("all");
          setPageIndex(0);
        },
      })),
    [filterState],
  );

  const clearFilters = useCallback(() => {
    const defaults = defaultCopyTradeFilterState();
    setGrade(defaults.grade);
    setConfidence(defaults.confidence);
    setSignal(defaults.signal);
    setSortBy(COPYTRADE_DEFAULT_SORT_BY);
    setPerPage(COPYTRADE_API_PAGE_SIZE);
    setPageIndex(0);
    setSelectedTraderId(null);
    setIsDetailOpen(false);
  }, []);

  const sorting = useMemo(
    (): SortingState => [
      {
        id: copyTradeTableColumnIdForSortBy(sortBy),
        desc: sortBy.endsWith("_desc"),
      },
    ],
    [sortBy],
  );

  const columns = useMemo(
    () =>
      createCopyTradeColumns({
        sortBy,
        onSortByChange: (next) => {
          setSortBy(next);
          setPageIndex(0);
        },
        onSelectTrader: (traderId) => {
          setSelectedTraderId(traderId);
          setIsDetailOpen(true);
        },
        selectedTraderId,
      }),
    [sortBy, selectedTraderId],
  );

  const handlePerPageChange = useCallback((next: number) => {
    const allowed = (COPYTRADE_PER_PAGE_OPTIONS as readonly number[]).includes(next);
    if (!allowed) return;
    setPerPage(next as CopyTradePerPageOption);
    setPageIndex(0);
  }, []);

  const showEmptyError = isError && !isLoading && totalCount === 0;
  const gatedByFreePlan = !mockEnabled && user?.planTier === "free" && totalAvailable > 10;

  return (
    <AppLayout title="Copy Trade Finder">
      <main className="container mx-auto flex max-w-7xl flex-col px-4 pb-4 pt-6 duration-700 animate-in fade-in sm:px-6">
        <PageHeader
          className="mb-6 shrink-0"
          label="Trader Ranking Intelligence"
          title="Copy Trade Finder"
          description="Performance-ranked leaderboard built on the GOLDH CopyTrade engine."
          icon={<Trophy className="h-5 w-5" />}
        />

        <div className="flex flex-col gap-3">
          <CopyTradeFiltersToolbar
            grade={grade}
            onGradeChange={(value) => {
              setGrade(value);
              setPageIndex(0);
            }}
            confidence={confidence}
            onConfidenceChange={(value) => {
              setConfidence(value);
              setPageIndex(0);
            }}
            signal={signal}
            onSignalChange={(value) => {
              setSignal(value);
              setPageIndex(0);
            }}
            isFetching={isFetching && !isLoading}
            onRefresh={() => refetch()}
          />

          {isError && !isLoading && totalCount > 0 ? (
            <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2">
              <WifiOff className="h-3.5 w-3.5 shrink-0 text-rose-400" />
              <p className="text-xs text-rose-300">
                {error instanceof Error ? error.message : "Failed to refresh leaderboard."}{" "}
                <button
                  type="button"
                  className="font-semibold text-rose-300 underline underline-offset-2 hover:text-rose-200"
                  onClick={() => refetch()}
                >
                  Retry now
                </button>
              </p>
            </div>
          ) : null}

          {gatedByFreePlan ? (
            <div className="rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2">
              <p className="text-xs text-amber-100">
                Free tier shows the top 10 traders. Upgrade to view the full leaderboard.
              </p>
            </div>
          ) : null}

          <ActiveFilterChips filters={activeFilters} onClearAll={clearFilters} className="hidden md:flex" />

          <div className="flex items-center justify-between gap-3 md:hidden">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="h-5 w-1 shrink-0 rounded-full bg-[#C7AE6A] shadow-[0_0_8px_rgba(199,174,106,0.3)]"
                aria-hidden
              />
              <h3 className="text-lg font-bold tracking-tight text-foreground">Leaderboard</h3>
              {!isLoading ? (
                <span className="rounded-md bg-[#1a1a1a] px-2 py-0.5 text-[10px] font-bold tabular-nums text-[#4a4a4a]">
                  {totalCount}
                </span>
              ) : null}
            </div>
            <CopyTradeMobileActions
              grade={grade}
              onGradeChange={(value) => {
                setGrade(value);
                setPageIndex(0);
              }}
              confidence={confidence}
              onConfidenceChange={(value) => {
                setConfidence(value);
                setPageIndex(0);
              }}
              signal={signal}
              onSignalChange={(value) => {
                setSignal(value);
                setPageIndex(0);
              }}
              isFetching={isFetching && !isLoading}
              onRefresh={() => refetch()}
              onClearAllFilters={clearFilters}
            />
          </div>

          <ActiveFilterChips filters={activeFilters} onClearAll={clearFilters} className="md:hidden" />

          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <div
              className="h-5 w-1 shrink-0 rounded-full bg-[#C7AE6A] shadow-[0_0_8px_rgba(199,174,106,0.3)]"
              aria-hidden
            />
            <h3 className="text-lg font-bold tracking-tight text-foreground">Leaderboard</h3>
            {!isLoading ? (
              <span className="rounded-md bg-[#1a1a1a] px-2 py-0.5 text-[10px] font-bold tabular-nums text-[#4a4a4a]">
                {totalCount}
              </span>
            ) : null}
          </div>

          {selectedTrader ? (
            <div className="rounded-xl border border-[#3b3118] bg-[#1a160d] px-3.5 py-2.5 shadow-[inset_0_0_0_1px_rgba(199,174,106,0.12)]">
              <div className="flex items-center gap-2">
                <UserRoundCheck className="h-3.5 w-3.5 text-[#C7AE6A]" />
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#ceb677]">
                  Selected Trader
                </p>
              </div>
              <p className="mt-1.5 text-sm text-[#f2e4be]">
                <span className="font-semibold">{selectedTrader.handle}</span>{" "}
                <span className="font-mono text-xs text-[#c9b07a]/90">
                  ({selectedTrader.traderId})
                </span>
              </p>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-3">
            <BaseTable
              columns={columns}
              data={pagedRows}
              totalCount={totalCount}
              isLoading={isLoading}
              isError={showEmptyError}
              documentHeightScroll
              getRowId={(row) => row.traderId}
              manualSorting
              sorting={sorting}
              onRowClick={(row) => {
                setSelectedTraderId(row.traderId);
                setIsDetailOpen(true);
              }}
              getRowClassName={(row) =>
                row.traderId === selectedTraderId
                  ? "bg-[#1b170d] ring-1 ring-inset ring-[#C7AE6A]/55"
                  : undefined
              }
              pagination={{
                pageSize: perPage,
                resetKey: `${grade}|${confidence}|${signal}|${sortBy}|${perPage}`,
              }}
              tableMinWidthClassName="min-w-[1120px] relative"
              skeletonColumnCount={10}
              emptyTitle="No traders found"
              emptyDescription="Refine filters or clear to show all leaderboard rows."
              onClearFilters={clearFilters}
              renderError={
                <div className="flex min-h-[16rem] flex-col items-center justify-center gap-4 rounded-2xl border border-[#222] bg-[#111111]/40 px-8 py-12 text-center backdrop-blur-xl">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#222] bg-[#1a1a1a]">
                    <WifiOff className="h-6 w-6 text-gray-500" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-sm font-bold text-white">Could not load leaderboard</p>
                    <p className="max-w-sm text-xs leading-relaxed text-gray-400">
                      {error instanceof Error ? error.message : "Check your connection and try again."}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="rounded-xl bg-[#C7AE6A] font-bold text-black hover:bg-[#b89d5a]"
                    onClick={() => refetch()}
                  >
                    Retry
                  </Button>
                </div>
              }
              showPagination={false}
              tableFooter={
                totalCount > 0 ? (
                  <NumberedPager
                    pageIndex={clampedPageIndex}
                    pageCount={pageCount}
                    totalCount={totalCount}
                    from={from}
                    to={to}
                    perPage={perPage}
                    perPageOptions={COPYTRADE_PER_PAGE_OPTIONS}
                    onPageChange={setPageIndex}
                    onPerPageChange={handlePerPageChange}
                    label="CopyTrade pagination"
                    isJumping={isFetching}
                  />
                ) : undefined
              }
            />
          </div>
        </div>
        {isDetailOpen ? (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm"
              onClick={() => setIsDetailOpen(false)}
              aria-hidden
            />
            <div className="fixed inset-y-0 right-0 z-50 w-full border-l border-[#222] bg-[#0a0a0a] shadow-2xl md:w-[540px]">
              <CopyTradeDetailPanel
                selectedTrader={selectedTrader}
                detail={selectedTraderDetail}
                isLoading={isDetailLoading}
                isError={isDetailError}
                error={detailError}
                onRetry={() => refetchDetail()}
                onClose={() => setIsDetailOpen(false)}
                hasLiveHistory30={Boolean(history30 && history30.length > 0)}
                hasLiveHistory90={Boolean(history90 && history90.length > 0)}
                hasHistoryError30={Boolean(history30Error)}
                hasHistoryError90={Boolean(history90Error)}
              />
            </div>
          </>
        ) : null}
      </main>
    </AppLayout>
  );
}
