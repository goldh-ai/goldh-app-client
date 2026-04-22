import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SortingState } from "@tanstack/react-table";
import type { ArbitrageSortByApi } from "@shared/types";
import { AppLayout } from "@/components/AppLayout";
import { BaseTable } from "@/components/shared/BaseTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { ActiveFilterChips, type FilterChip } from "@/components/shared/ActiveFilterChips";
import { NumberedPager } from "@/components/shared/NumberedPager";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { institutionalTableBelowCalloutClass } from "@/lib/institutionalDataChrome";
import { cn } from "@/lib/utils";
import { useArbitrageOpportunities } from "../hooks/useArbitrageOpportunities";
import { ArbitrageTierGate } from "../components/ArbitrageTierGate";
import {
  ArbitrageFiltersToolbar,
  ArbitrageMobileActions,
} from "../components/ArbitrageFiltersToolbar";
import { ArbitragePrimeStrip } from "../components/ArbitragePrimeStrip";
import { createArbitrageColumns } from "../lib/createArbitrageColumns";
import {
  ArbitrageHttpError,
  fetchArbitrageOpportunitiesPage,
} from "../lib/arbitrageApi";
import {
  ARBITRAGE_API_PAGE_SIZE,
  ARBITRAGE_PAIR_SEARCH_DEBOUNCE_MS,
  ARBITRAGE_PER_PAGE_OPTIONS,
  type ArbitragePerPageOption,
} from "../lib/arbitrageConstants";
import { ARBITRAGE_TABLE_MIN_WIDTH_CLASS } from "../lib/arbitrageTableLayout";
import {
  collectActiveArbitrageFilters,
  defaultArbitrageFilterState,
  type ArbitrageFilterState,
} from "../lib/arbitrageFilters";
import {
  ARBITRAGE_DEFAULT_SORT_BY,
  ARBITRAGE_DEFAULT_SORT_DIR,
  arbitrageOpportunityStableId,
  arbitrageTableColumnIdForSortBy,
  ARBITRAGE_SORT_DIR,
  type ArbitrageSortDir,
} from "../lib/arbitrageSort";
import { ArrowRightLeft, RefreshCw, ShieldAlert, WifiOff } from "lucide-react";

const MARKET_REGIME_REFRESH_MS = 5 * 60 * 1000;

type MarketRegime = "volatile" | "stable" | "trending";

function getSpreadCompressionSpeed(meta: unknown): string | number | undefined {
  if (!meta || typeof meta !== "object") return undefined;
  const m = meta as Record<string, unknown>;
  const speed = m.spread_compression_speed;
  if (typeof speed === "number" || typeof speed === "string") return speed;
  return undefined;
}

function resolveMarketRegime(speed: string | number | undefined): MarketRegime {
  if (typeof speed === "number") {
    if (speed >= 0.7) return "volatile";
    if (speed <= 0.3) return "trending";
    return "stable";
  }
  if (typeof speed === "string") {
    const normalized = speed.trim().toLowerCase();
    if (
      normalized.includes("closing_fast") ||
      normalized.includes("closing fast") ||
      normalized.includes("high") ||
      normalized.includes("widening") ||
      normalized.includes("volatile")
    ) {
      return "volatile";
    }
    if (
      normalized.includes("stable") ||
      normalized.includes("normal") ||
      normalized.includes("medium")
    ) {
      return "stable";
    }
    if (
      normalized.includes("compressing") ||
      normalized.includes("closing_slow") ||
      normalized.includes("closing slow") ||
      normalized.includes("low") ||
      normalized.includes("tight")
    ) {
      return "trending";
    }
  }
  return "stable";
}

function MarketRegimeBanner({ regime }: { regime: MarketRegime }) {
  if (regime === "volatile") {
    return (
      <div className="rounded-lg border border-rose-500/35 bg-rose-500/12 px-3 py-2">
        <p className="text-xs font-medium text-rose-100">
          <span className="font-bold text-rose-300">🔴 VOLATILE</span>
          {" — "}
          Spreads expanding, execute fast or miss opportunities
        </p>
      </div>
    );
  }
  if (regime === "trending") {
    return (
      <div className="rounded-lg border border-sky-500/35 bg-sky-500/12 px-3 py-2">
        <p className="text-xs font-medium text-sky-100">
          <span className="font-bold text-sky-300">🔵 TRENDING</span>
          {" — "}
          Spreads tight, wait for rebalancing
        </p>
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-amber-500/35 bg-amber-500/12 px-3 py-2">
      <p className="text-xs font-medium text-amber-100">
        <span className="font-bold text-amber-300">🟡 STABLE</span>
        {" — "}
        Good execution window, profit predictable
      </p>
    </div>
  );
}

function arbitrageErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ArbitrageHttpError && error.status === 503) {
    return "The arbitrage snapshot is being regenerated. This usually takes a few seconds.";
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export default function ArbitrageScannerPage() {
  const { user } = useAuth();
  const pro = ["pro", "elite", "admin"].includes(user?.planTier ?? "");

  const [pairQuery, setPairQuery] = useState("");
  const [debouncedPairQuery, setDebouncedPairQuery] = useState("");
  const [grade, setGrade] = useState<string>("all");
  const [confidence, setConfidence] = useState<string>("all");
  const [signal, setSignal] = useState<string>("all");
  const [sortBy, setSortBy] = useState<ArbitrageSortByApi>(ARBITRAGE_DEFAULT_SORT_BY);
  const [sortDir, setSortDir] = useState<ArbitrageSortDir>(ARBITRAGE_DEFAULT_SORT_DIR);
  const [perPage, setPerPage] = useState<number>(ARBITRAGE_API_PAGE_SIZE);
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);
  const [cursorPageIndex, setCursorPageIndex] = useState(0);
  const [isJumpingForward, setIsJumpingForward] = useState(false);

  useEffect(() => {
    if (pairQuery.trim() === "") {
      setDebouncedPairQuery("");
      return;
    }
    const id = window.setTimeout(() => {
      setDebouncedPairQuery(pairQuery);
    }, ARBITRAGE_PAIR_SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [pairQuery]);

  const filterState: ArbitrageFilterState = useMemo(
    () => ({ pairQuery, grade, confidence, signal }),
    [pairQuery, grade, confidence, signal],
  );

  /** Any change that invalidates server cursors (filters, sort, or page size) resets the stack. */
  const cursorResetKey = useMemo(
    () =>
      `${debouncedPairQuery}|${grade}|${confidence}|${signal}|${sortBy}|${sortDir}|${perPage}`,
    [debouncedPairQuery, grade, confidence, signal, sortBy, sortDir, perPage],
  );
  const currentCursor = cursorStack[cursorPageIndex] ?? null;

  useEffect(() => {
    setCursorStack([null]);
    setCursorPageIndex(0);
  }, [cursorResetKey]);

  const {
    flatOpportunities,
    meta,
    pagination,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useArbitrageOpportunities({
    enabled: pro,
    cursor: currentCursor,
    pair: debouncedPairQuery,
    grade,
    confidence,
    signal,
    sortBy,
    sortDir,
    pageSize: perPage,
  });

  /**
   * Latest request args captured in a ref so the walk-forward handler never
   * races a filter/sort change: the fetch loop aborts if these drift.
   */
  const walkArgsRef = useRef({
    pair: debouncedPairQuery,
    grade,
    confidence,
    signal,
    sortBy,
    pageSize: perPage,
  });
  useEffect(() => {
    walkArgsRef.current = {
      pair: debouncedPairQuery,
      grade,
      confidence,
      signal,
      sortBy,
      pageSize: perPage,
    };
  }, [debouncedPairQuery, grade, confidence, signal, sortBy, perPage]);

  const handleSortChange = useCallback(
    (next: ArbitrageSortByApi) => {
      if (sortBy === next) {
        setSortDir((d) =>
          d === ARBITRAGE_SORT_DIR.DESC
            ? ARBITRAGE_SORT_DIR.ASC
            : ARBITRAGE_SORT_DIR.DESC,
        );
      } else {
        setSortBy(next);
        setSortDir(ARBITRAGE_SORT_DIR.DESC);
      }
    },
    [sortBy],
  );

  const arbitrageSorting = useMemo((): SortingState => {
    return [
      {
        id: arbitrageTableColumnIdForSortBy(sortBy),
        desc: sortDir === ARBITRAGE_SORT_DIR.DESC,
      },
    ];
  }, [sortBy, sortDir]);

  const columns = useMemo(
    () =>
      createArbitrageColumns({
        onSortByChange: handleSortChange,
      }),
    [handleSortChange],
  );

  const activeFilters: FilterChip[] = useMemo(
    () =>
      collectActiveArbitrageFilters(filterState).map(({ field, label, value }) => ({
        label,
        value,
        onRemove: () => {
          if (field === "pair") {
            setPairQuery("");
          } else if (field === "grade") {
            setGrade("all");
          } else if (field === "confidence") {
            setConfidence("all");
          } else {
            setSignal("all");
          }
        },
      })),
    [filterState],
  );

  function clearFilters() {
    const d = defaultArbitrageFilterState();
    setPairQuery(d.pairQuery);
    setDebouncedPairQuery(d.pairQuery);
    setGrade(d.grade);
    setConfidence(d.confidence);
    setSignal(d.signal);
    setSortBy(ARBITRAGE_DEFAULT_SORT_BY);
    setSortDir(ARBITRAGE_DEFAULT_SORT_DIR);
    setPerPage(ARBITRAGE_API_PAGE_SIZE);
    setCursorStack([null]);
    setCursorPageIndex(0);
  }

  const opportunitiesTotal = meta?.total ?? flatOpportunities.length;
  const totalCursorPages = Math.max(
    1,
    Math.ceil(opportunitiesTotal / perPage),
  );
  const cursorFrom =
    opportunitiesTotal === 0 ? 0 : cursorPageIndex * perPage + 1;
  const cursorTo = Math.min((cursorPageIndex + 1) * perPage, opportunitiesTotal);

  /**
   * A forward page is reachable if either it's already in the cursor stack,
   * or we have an un-walked tail with a known nextCursor to extend from.
   */
  const canJumpForward = useCallback(
    (target: number) => {
      if (target <= cursorStack.length - 1) return true;
      return Boolean(pagination?.hasMore && pagination?.nextCursor);
    },
    [cursorStack.length, pagination?.hasMore, pagination?.nextCursor],
  );


  const walkForwardTo = useCallback(
    async (targetPageIndex: number, startStack: (string | null)[]) => {
      const snapshot = walkArgsRef.current;
      let stack = startStack;
      let nextCursor: string | null | undefined =
        pagination?.hasMore ? pagination?.nextCursor ?? undefined : undefined;

      while (stack.length - 1 < targetPageIndex) {
        if (!nextCursor) break;
        const page = await fetchArbitrageOpportunitiesPage({
          cursor: nextCursor,
          pair: snapshot.pair,
          grade: snapshot.grade,
          confidence: snapshot.confidence,
          signal: snapshot.signal,
          sortBy: snapshot.sortBy,
          pageSize: snapshot.pageSize,
        });
        if (walkArgsRef.current !== snapshot) return stack;
        stack = [...stack, nextCursor];
        if (!page.raw.pagination.hasMore) break;
        nextCursor = page.raw.pagination.nextCursor ?? undefined;
      }
      return stack;
    },
    [pagination?.hasMore, pagination?.nextCursor],
  );

  const handlePageChange = useCallback(
    async (target: number) => {
      const clamped = Math.max(0, Math.min(target, totalCursorPages - 1));
      if (clamped === cursorPageIndex) return;

      if (clamped <= cursorStack.length - 1) {
        setCursorPageIndex(clamped);
        return;
      }

      if (!canJumpForward(clamped)) return;

      setIsJumpingForward(true);
      try {
        const grown = await walkForwardTo(clamped, cursorStack);
        if (grown.length - 1 >= clamped) {
          setCursorStack(grown);
          setCursorPageIndex(clamped);
        } else if (grown.length - 1 > cursorStack.length - 1) {
          setCursorStack(grown);
          setCursorPageIndex(grown.length - 1);
        }
      } catch (e) {
        console.warn("[arbitrage] forward page walk failed", e);
      } finally {
        setIsJumpingForward(false);
      }
    },
    [
      cursorPageIndex,
      cursorStack,
      totalCursorPages,
      canJumpForward,
      walkForwardTo,
    ],
  );

  const handlePerPageChange = useCallback((next: number) => {
    const allowed = (ARBITRAGE_PER_PAGE_OPTIONS as readonly number[]).includes(
      next,
    );
    if (!allowed) return;
    setPerPage(next as ArbitragePerPageOption);
  }, []);

  const showEmptyError = isError && !isLoading && flatOpportunities.length === 0;
  const marketRegime = useMemo(() => {
    const speed = getSpreadCompressionSpeed(meta);
    return resolveMarketRegime(speed);
  }, [meta]);

  useEffect(() => {
    if (!pro) return;
    const id = window.setInterval(() => {
      void refetch();
    }, MARKET_REGIME_REFRESH_MS);
    return () => window.clearInterval(id);
  }, [pro, refetch]);

  return (
    <AppLayout title="Arbitrage Scanner">
      <main className="container mx-auto flex max-w-7xl flex-col px-4 pb-4 pt-6 duration-700 animate-in fade-in sm:px-6">
        <PageHeader
          className="mb-6 shrink-0"
          label="Price Inefficiency Intelligence"
          title="Arbitrage Scanner"
          description="Institutional-grade arbitrage scanner built on the GOLDH Intelligence Engine."
          icon={<ArrowRightLeft className="h-5 w-5" />}
        />

        {!pro ? (
          <ArbitrageTierGate />
        ) : (
          <div className="flex flex-col gap-3">
            <ArbitrageFiltersToolbar
              pairQuery={pairQuery}
              onPairQueryChange={setPairQuery}
              grade={grade}
              onGradeChange={setGrade}
              confidence={confidence}
              onConfidenceChange={setConfidence}
              signal={signal}
              onSignalChange={setSignal}
              isFetching={isFetching && !isLoading}
              onRefresh={() => refetch()}
            />

            {meta?.contract_status === "mismatch" ? (
              <div className="flex items-center gap-2 rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2">
                <RefreshCw className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                <p className="text-xs text-amber-100">
                  The data model for this screen has changed. Refresh the page to load the latest
                  layout.{" "}
                  <button
                    type="button"
                    className="font-semibold text-amber-200 underline underline-offset-2 hover:text-amber-50"
                    onClick={() => window.location.reload()}
                  >
                    Refresh now
                  </button>
                </p>
              </div>
            ) : null}

            {isError && !isLoading && flatOpportunities.length > 0 ? (
              <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2">
                <WifiOff className="h-3.5 w-3.5 shrink-0 text-rose-400" />
                <p className="text-xs text-rose-300">
                  {arbitrageErrorMessage(error, "Failed to refresh opportunities.")}{" "}
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

            <ActiveFilterChips
              filters={activeFilters}
              onClearAll={clearFilters}
              className="hidden md:flex"
            />

            <div className="flex items-center justify-between gap-3 md:hidden">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="h-5 w-1 shrink-0 rounded-full bg-[#C7AE6A] shadow-[0_0_8px_rgba(199,174,106,0.3)]"
                  aria-hidden
                />
                <h3 className="text-lg font-bold tracking-tight text-foreground">Opportunities</h3>
                {!isLoading ? (
                  <span className="rounded-md bg-[#1a1a1a] px-2 py-0.5 text-[10px] font-bold tabular-nums text-[#4a4a4a]">
                    {opportunitiesTotal}
                  </span>
                ) : null}
              </div>
              <ArbitrageMobileActions
                pairQuery={pairQuery}
                onPairQueryChange={setPairQuery}
                grade={grade}
                onGradeChange={setGrade}
                confidence={confidence}
                onConfidenceChange={setConfidence}
                signal={signal}
                onSignalChange={setSignal}
                isFetching={isFetching && !isLoading}
                onRefresh={() => refetch()}
                onClearAllFilters={clearFilters}
              />
            </div>
            <div className="md:hidden">
              <MarketRegimeBanner regime={marketRegime} />
            </div>

            <ActiveFilterChips
              filters={activeFilters}
              onClearAll={clearFilters}
              className="md:hidden"
            />

            <div className="flex flex-col gap-3 md:gap-3">
              <div className="hidden shrink-0 items-center gap-3 md:flex">
                <div
                  className="h-5 w-1 shrink-0 rounded-full bg-[#C7AE6A] shadow-[0_0_8px_rgba(199,174,106,0.3)]"
                  aria-hidden
                />
                <h3 className="text-lg font-bold tracking-tight text-foreground">Opportunities</h3>
                {!isLoading ? (
                  <span className="rounded-md bg-[#1a1a1a] px-2 py-0.5 text-[10px] font-bold tabular-nums text-[#4a4a4a]">
                    {opportunitiesTotal}
                  </span>
                ) : null}
              </div>
              <div className="hidden md:block">
                <MarketRegimeBanner regime={marketRegime} />
              </div>

              {!isLoading && !showEmptyError && flatOpportunities.length > 0 ? (
                <ArbitragePrimeStrip items={flatOpportunities} />
              ) : null}

              <BaseTable
                columns={columns}
                data={flatOpportunities}
                totalCount={opportunitiesTotal}
                isLoading={isLoading}
                isError={showEmptyError}
                documentHeightScroll
                getRowId={(row) => arbitrageOpportunityStableId(row)}
                manualSorting
                sorting={arbitrageSorting}
                pagination={{
                  pageSize: perPage,
                  resetKey: cursorResetKey,
                }}
                tableMinWidthClassName={ARBITRAGE_TABLE_MIN_WIDTH_CLASS}
                skeletonColumnCount={13}
                emptyTitle="No matching opportunities"
                emptyDescription="Refine filters or clear to show all rows."
                onClearFilters={clearFilters}
                renderError={
                  <div className="flex min-h-[16rem] flex-col items-center justify-center gap-4 rounded-2xl border border-[#222] bg-[#111111]/40 px-8 py-12 text-center backdrop-blur-xl">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#222] bg-[#1a1a1a]">
                      <WifiOff className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-sm font-bold text-white">Could not load opportunities</p>
                      <p className="max-w-sm text-xs leading-relaxed text-gray-400">
                        {arbitrageErrorMessage(
                          error,
                          "Check your connection and session, then try again.",
                        )}
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
                  flatOpportunities.length > 0 ? (
                    <NumberedPager
                      pageIndex={cursorPageIndex}
                      pageCount={totalCursorPages}
                      totalCount={opportunitiesTotal}
                      from={cursorFrom}
                      to={cursorTo}
                      perPage={perPage}
                      perPageOptions={ARBITRAGE_PER_PAGE_OPTIONS}
                      onPageChange={handlePageChange}
                      onPerPageChange={handlePerPageChange}
                      canJumpForward={canJumpForward}
                      isJumping={isJumpingForward || isFetching}
                      label="Arbitrage pagination"
                    />
                  ) : undefined
                }
              />
            </div>

            {!isLoading ? (
              <div
                className={cn(
                  "mt-2 flex shrink-0 items-start gap-2.5",
                  institutionalTableBelowCalloutClass,
                )}
              >
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 opacity-80" aria-hidden />
                <p className="text-sm leading-relaxed">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground/85">
                    Intelligence only
                  </span>
                  {" — "}
                  Arbitrage Scanner provides feasibility-scored intelligence. It is not an execution
                  engine, auto-trading system, or performance guarantee. All opportunities require
                  independent verification before action.
                </p>
              </div>
            ) : null}
          </div>
        )}
      </main>
    </AppLayout>
  );
}
