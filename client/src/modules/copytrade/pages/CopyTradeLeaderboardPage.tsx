import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SortingState } from "@tanstack/react-table";
import { Trophy } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { ActiveFilterChips, type FilterChip } from "@/components/shared/ActiveFilterChips";
import { BaseTable } from "@/components/shared/BaseTable";
import { NumberedPager } from "@/components/shared/NumberedPager";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAuth } from "@/lib/auth";
import {
  collectActiveCopyTradeFilters,
  defaultCopyTradeFilterState,
  type CopyTradeFilterState,
} from "../lib/copyTradeFilters";
import {
  COPYTRADE_API_PAGE_SIZE,
  COPYTRADE_PER_PAGE_OPTIONS,
  COPYTRADE_TRADER_SEARCH_DEBOUNCE_MS,
  type CopyTradePerPageOption,
} from "../lib/copyTradeConstants";
import { createCopyTradeColumns } from "../lib/createCopyTradeColumns";
import {
  COPYTRADE_DEFAULT_SORT_BY,
  copyTradeTableColumnIdForSortBy,
} from "../lib/copyTradeSort";
import { fetchCopyTradeLeaderboard } from "../lib/copyTradeApi";
import { useCopyTradeTraders } from "../hooks/useCopyTradeTraders";
import {
  CopyTradeFiltersToolbar,
  CopyTradeMobileActions,
} from "../components/CopyTradeFiltersToolbar";
import { useCopyTradeTraderDetail } from "../hooks/useCopyTradeTraderDetail";
import { CopyTradeDetailPanel } from "../components/CopyTradeDetailPanel";
import {
  LeaderboardInlineError,
  LeaderboardSectionTitle,
  LeaderboardTableError,
} from "./copyTradeLeaderboardPage/index";

export default function CopyTradeLeaderboardPage() {
  const { user } = useAuth();
  const [traderQuery, setTraderQuery] = useState("");
  const [debouncedTraderSearch, setDebouncedTraderSearch] = useState("");
  const [grade, setGrade] = useState<string>("all");
  const [confidence, setConfidence] = useState<string>("all");
  const [signal, setSignal] = useState<string>("all");
  const [capacity, setCapacity] = useState<string>("all");
  const [sortBy, setSortBy] = useState(COPYTRADE_DEFAULT_SORT_BY);
  const [perPage, setPerPage] = useState<number>(COPYTRADE_API_PAGE_SIZE);
  const [pageIndex, setPageIndex] = useState(0);
  const [cursorByPage, setCursorByPage] = useState<Record<number, string | null>>({
    0: null,
  });
  const [isJumpingForward, setIsJumpingForward] = useState(false);
  const [selectedTraderId, setSelectedTraderId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const currentCursor = cursorByPage[pageIndex] ?? null;
  const walkArgsRef = useRef({
    grade: "all",
    confidence: "all",
    signal: "all",
    capacity: "all",
    traderSearch: "",
    sortBy: COPYTRADE_DEFAULT_SORT_BY,
    pageSize: COPYTRADE_API_PAGE_SIZE,
  });

  useEffect(() => {
    if (traderQuery.trim() === "") {
      setDebouncedTraderSearch("");
      return;
    }
    const id = window.setTimeout(() => {
      setDebouncedTraderSearch(traderQuery);
    }, COPYTRADE_TRADER_SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [traderQuery]);

  useEffect(() => {
    setPageIndex(0);
    setCursorByPage({ 0: null });
  }, [debouncedTraderSearch]);

  const filterState: CopyTradeFilterState = useMemo(
    () => ({
      grade,
      confidence,
      signal,
      capacity,
      traderSearch: debouncedTraderSearch,
    }),
    [grade, confidence, signal, capacity, debouncedTraderSearch],
  );

  const {
    traders,
    totalAvailable,
    nextCursor,
    hasMore,
    tierRestricted,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    mockEnabled,
  } =
    useCopyTradeTraders({
      enabled: Boolean(user),
      grade,
      confidence,
      signal,
      capacity,
      traderSearch: debouncedTraderSearch,
      sortBy,
      pageSize: perPage,
      cursor: currentCursor,
    });

  const totalCount = totalAvailable;
  const pageCount = Math.max(1, Math.ceil(totalCount / perPage));
  const clampedPageIndex = Math.min(pageIndex, pageCount - 1);
  const from = totalCount === 0 ? 0 : pageIndex * perPage + 1;
  const to = totalCount === 0 ? 0 : Math.min(from + traders.length - 1, totalCount);
  const selectedTrader = useMemo(
    () => traders.find((trader) => trader.traderId === selectedTraderId),
    [traders, selectedTraderId],
  );

  useEffect(() => {
    if (!nextCursor || !hasMore) return;
    setCursorByPage((prev) => {
      const nextPage = pageIndex + 1;
      if (prev[nextPage] === nextCursor) return prev;
      return { ...prev, [nextPage]: nextCursor };
    });
  }, [pageIndex, nextCursor, hasMore]);

  useEffect(() => {
    walkArgsRef.current = {
      grade,
      confidence,
      signal,
      capacity,
      traderSearch: debouncedTraderSearch,
      sortBy,
      pageSize: perPage,
    };
  }, [grade, confidence, signal, capacity, debouncedTraderSearch, sortBy, perPage]);

  useEffect(() => {
    if (isFetching || isLoading || isError) return;
    if (totalCount === 0 && cursorByPage[pageIndex] != null) return;
    if (clampedPageIndex !== pageIndex) setPageIndex(clampedPageIndex);
  }, [
    clampedPageIndex,
    pageIndex,
    isFetching,
    isLoading,
    isError,
    totalCount,
    cursorByPage,
  ]);

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
    history365Error,
    isFetching: isDetailHistoryFetching,
  } = useCopyTradeTraderDetail({
    traderId: selectedTraderId,
    baseTrader: selectedTrader,
    enabled: Boolean(user) && Boolean(selectedTraderId),
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
          if (field === "capacity") setCapacity("all");
          if (field === "traderSearch") setTraderQuery("");
          setPageIndex(0);
          setCursorByPage({ 0: null });
        },
      })),
    [filterState],
  );

  const clearFilters = useCallback(() => {
    const defaults = defaultCopyTradeFilterState();
    setTraderQuery(defaults.traderSearch);
    setGrade(defaults.grade);
    setConfidence(defaults.confidence);
    setSignal(defaults.signal);
    setCapacity(defaults.capacity);
    setSortBy(COPYTRADE_DEFAULT_SORT_BY);
    setPerPage(COPYTRADE_API_PAGE_SIZE);
    setPageIndex(0);
    setCursorByPage({ 0: null });
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
          setCursorByPage({ 0: null });
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
    setCursorByPage({ 0: null });
  }, []);

  const canJumpForward = useCallback(
    (target: number) => {
      if (target <= pageIndex) return true;
      if (cursorByPage[target] != null) return true;
      return Boolean(hasMore && nextCursor);
    },
    [pageIndex, cursorByPage, hasMore, nextCursor],
  );

  const walkForwardTo = useCallback(
    async (targetPageIndex: number, startMap: Record<number, string | null>) => {
      const snapshot = walkArgsRef.current;
      const grown: Record<number, string | null> = { ...startMap };
      let probePage = pageIndex + 1;
      let probeCursor: string | null | undefined =
        grown[probePage] ?? nextCursor ?? undefined;

      while (probePage <= targetPageIndex) {
        if (!probeCursor) break;
        if (grown[probePage] == null) grown[probePage] = probeCursor;
        if (probePage === targetPageIndex) break;

        const page = await fetchCopyTradeLeaderboard({
          grade: snapshot.grade,
          confidence: snapshot.confidence,
          signal: snapshot.signal,
          capacity: snapshot.capacity,
          search: snapshot.traderSearch.trim() || undefined,
          sortBy: snapshot.sortBy,
          pageSize: snapshot.pageSize,
          cursor: probeCursor,
        });
        if (walkArgsRef.current !== snapshot) return grown;
        if (!page.raw.pagination?.hasMore || !page.raw.pagination?.nextCursor) break;
        probeCursor = page.raw.pagination.nextCursor;
        probePage += 1;
      }

      return grown;
    },
    [pageIndex, nextCursor],
  );

  const handlePageChange = useCallback(
    async (target: number) => {
      const next = Math.max(0, Math.min(target, pageCount - 1));
      if (next === pageIndex) return;
      if (next <= pageIndex || cursorByPage[next] != null) {
        setPageIndex(next);
        return;
      }
      if (!canJumpForward(next)) return;

      setIsJumpingForward(true);
      try {
        const grown = await walkForwardTo(next, cursorByPage);
        setCursorByPage(grown);
        if (grown[next] != null) {
          setPageIndex(next);
          return;
        }
        const fallback = Math.max(
          0,
          ...Object.keys(grown)
            .map((k) => Number(k))
            .filter((n) => Number.isFinite(n)),
        );
        setPageIndex(Math.min(fallback, pageCount - 1));
      } catch (e) {
        console.warn("[copytrade] forward page walk failed", e);
      } finally {
        setIsJumpingForward(false);
      }
    },
    [pageCount, pageIndex, cursorByPage, canJumpForward, walkForwardTo],
  );

  const showEmptyError = isError && !isLoading && totalCount === 0;
  const gatedByFreePlan = !mockEnabled && tierRestricted;

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
            traderQuery={traderQuery}
            onTraderQueryChange={setTraderQuery}
            grade={grade}
            onGradeChange={(value) => {
              setGrade(value);
              setPageIndex(0);
              setCursorByPage({ 0: null });
            }}
            confidence={confidence}
            onConfidenceChange={(value) => {
              setConfidence(value);
              setPageIndex(0);
              setCursorByPage({ 0: null });
            }}
            signal={signal}
            onSignalChange={(value) => {
              setSignal(value);
              setPageIndex(0);
              setCursorByPage({ 0: null });
            }}
            capacity={capacity}
            onCapacityChange={(value) => {
              setCapacity(value);
              setPageIndex(0);
              setCursorByPage({ 0: null });
            }}
            isFetching={isFetching && !isLoading}
            onRefresh={() => refetch()}
          />

          {isError && !isLoading && totalCount > 0 ? (
            <LeaderboardInlineError error={error} onRetry={() => refetch()} />
          ) : null}

          {gatedByFreePlan ? (
            <div className="rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2">
              <p className="text-xs text-amber-100">
                Your current plan is restricted for full leaderboard access. Upgrade to unlock all rows.
              </p>
            </div>
          ) : null}

          <ActiveFilterChips filters={activeFilters} onClearAll={clearFilters} className="hidden md:flex" />

          <div className="flex items-center justify-between gap-3 md:hidden">
            <div className="flex min-w-0 items-center gap-3">
              <LeaderboardSectionTitle totalCount={totalCount} isLoading={isLoading} />
            </div>
            <CopyTradeMobileActions
              traderQuery={traderQuery}
              onTraderQueryChange={setTraderQuery}
              grade={grade}
              onGradeChange={(value) => {
                setGrade(value);
                setPageIndex(0);
                setCursorByPage({ 0: null });
              }}
              confidence={confidence}
              onConfidenceChange={(value) => {
                setConfidence(value);
                setPageIndex(0);
                setCursorByPage({ 0: null });
              }}
              signal={signal}
              onSignalChange={(value) => {
                setSignal(value);
                setPageIndex(0);
                setCursorByPage({ 0: null });
              }}
              capacity={capacity}
              onCapacityChange={(value) => {
                setCapacity(value);
                setPageIndex(0);
                setCursorByPage({ 0: null });
              }}
              isFetching={isFetching && !isLoading}
              onRefresh={() => refetch()}
              onClearAllFilters={clearFilters}
            />
          </div>

          <ActiveFilterChips filters={activeFilters} onClearAll={clearFilters} className="md:hidden" />

          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <LeaderboardSectionTitle totalCount={totalCount} isLoading={isLoading} />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <BaseTable
              columns={columns}
              data={traders}
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
                  ? // `border-b` on `<td>` sits on the row edge and hides an inset ring bottom; drop it so the frame reads on all sides.
                  "relative z-[1] bg-primary/10 ring-1 ring-inset ring-primary/60 [&>td]:border-b-transparent"
                  : undefined
              }
              pagination={{
                pageSize: perPage,
                resetKey: `${grade}|${confidence}|${signal}|${capacity}|${debouncedTraderSearch}|${sortBy}|${perPage}`,
              }}
              tableMinWidthClassName="min-w-[1320px] relative [&_th]:px-3 [&_td]:px-3 [&_th:last-child]:pr-8 [&_td:last-child]:pr-8"
              skeletonColumnCount={14}
              emptyTitle="No traders found"
              emptyDescription="Refine filters or clear to show all leaderboard rows."
              onClearFilters={clearFilters}
              renderError={<LeaderboardTableError error={error} onRetry={() => refetch()} />}
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
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                    label="CopyTrade pagination"
                    canJumpForward={canJumpForward}
                    isJumping={isJumpingForward || isFetching}
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
            <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[min(100vw,1080px)] border-l border-border bg-background shadow-2xl md:w-[min(92vw,920px)] xl:w-[min(88vw,1000px)]">
              <CopyTradeDetailPanel
                selectedTrader={selectedTrader}
                detail={selectedTraderDetail}
                isLoading={isDetailLoading}
                isError={isDetailError}
                error={detailError}
                onRetry={() => refetchDetail()}
                onClose={() => setIsDetailOpen(false)}
                isHistoryFetching={isDetailHistoryFetching && !isDetailLoading}
                hasHistoryError30={Boolean(history30Error)}
                hasHistoryError90={Boolean(history90Error)}
                hasHistoryError365={Boolean(history365Error)}
              />
            </div>
          </>
        ) : null}
      </main>
    </AppLayout>
  );
}
