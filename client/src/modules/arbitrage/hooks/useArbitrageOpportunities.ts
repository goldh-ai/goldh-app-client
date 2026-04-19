import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  mapArbitrageOpportunityFromApiDto,
  type ArbitrageOpportunity,
  type ArbitrageSortByApi,
} from "@shared/types";
import { isArbitrageMockEnabled } from "@/lib/arbitrageMock";
import {
  ARBITRAGE_API_PAGE_SIZE,
  ARBITRAGE_OPPORTUNITIES_REFETCH_MS,
} from "../lib/arbitrageConstants";
import {
  ArbitrageHttpError,
  fetchArbitrageOpportunitiesPage,
} from "../lib/arbitrageApi";
import {
  sortArbitrageOpportunitiesForDisplay,
  type ArbitrageSortDir,
} from "../lib/arbitrageSort";

const EMPTY: ArbitrageOpportunity[] = [];

export type UseArbitrageOpportunitiesArgs = {
  enabled: boolean;
  cursor: string | null;
  pair: string;
  grade: string;
  confidence: string;
  signal: string;
  sortBy: ArbitrageSortByApi;
  sortDir: ArbitrageSortDir;
  /** Page size to request from the server. Defaults to ARBITRAGE_API_PAGE_SIZE. */
  pageSize?: number;
};

function matchesPair(row: ArbitrageOpportunity, q: string): boolean {
  if (!q) return true;
  return row.pair.toLowerCase().includes(q.toLowerCase());
}

function matchesFilter(value: string, filter: string): boolean {
  if (!filter || filter === "all") return true;
  return value === filter;
}

export function useArbitrageOpportunities(args: UseArbitrageOpportunitiesArgs) {
  const mockEnabled = isArbitrageMockEnabled();
  const effectivePageSize = args.pageSize ?? ARBITRAGE_API_PAGE_SIZE;
  const [pollIntervalMs, setPollIntervalMs] = useState(
    ARBITRAGE_OPPORTUNITIES_REFETCH_MS,
  );

  useEffect(() => {
    setPollIntervalMs(ARBITRAGE_OPPORTUNITIES_REFETCH_MS);
  }, [args.grade, args.confidence, args.signal, args.sortBy]);

  const mockQuery = useQuery({
    queryKey: ["arbitrage", "mock", "fixture"],
    queryFn: async () => {
      const { ARBITRAGE_MOCK_OPPORTUNITIES_DTO } =
        await import("@/mock/arbitrage.mock");
      return ARBITRAGE_MOCK_OPPORTUNITIES_DTO.map(
        mapArbitrageOpportunityFromApiDto,
      );
    },
    enabled: args.enabled && mockEnabled,
    staleTime: 60_000,
  });

  const apiQuery = useQuery({
    queryKey: [
      "arbitrage",
      "v1",
      "opportunities",
      args.cursor ?? "__first_page__",
      args.pair,
      args.grade,
      args.confidence,
      args.signal,
      args.sortBy,
      effectivePageSize,
    ],
    queryFn: () =>
      fetchArbitrageOpportunitiesPage({
        cursor: args.cursor,
        pair: args.pair,
        grade: args.grade,
        confidence: args.confidence,
        signal: args.signal,
        sortBy: args.sortBy,
        pageSize: effectivePageSize,
      }),
    enabled: args.enabled && !mockEnabled,
    retry: (failureCount, error) => {
      if (error instanceof ArbitrageHttpError && error.status === 503) {
        return failureCount < 5;
      }
      return failureCount < 2;
    },
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
    refetchInterval: args.enabled && !mockEnabled ? pollIntervalMs : false,
  });

  const apiPage = apiQuery.data;
  const metaRefreshMs = apiPage?.raw.meta.refresh_interval_ms;
  useEffect(() => {
    if (typeof metaRefreshMs !== "number" || metaRefreshMs <= 0) return;
    setPollIntervalMs((prev) =>
      prev === metaRefreshMs ? prev : metaRefreshMs,
    );
  }, [metaRefreshMs]);

  const flatOpportunities = useMemo(() => {
    if (mockEnabled) {
      const src = mockQuery.data;
      if (!src?.length) return EMPTY;
      const filtered = src.filter(
        (row) =>
          matchesPair(row, args.pair) &&
          matchesFilter(row.grade, args.grade) &&
          matchesFilter(row.confidenceBand, args.confidence) &&
          matchesFilter(row.signalState, args.signal),
      );
      return sortArbitrageOpportunitiesForDisplay(
        filtered,
        args.sortBy,
        args.sortDir,
      );
    }

    const currentPageRows = apiQuery.data?.opportunities;
    if (!currentPageRows?.length) return EMPTY;
    return sortArbitrageOpportunitiesForDisplay(
      currentPageRows,
      args.sortBy,
      args.sortDir,
    );
  }, [
    mockEnabled,
    mockQuery.data,
    apiQuery.data,
    args.pair,
    args.grade,
    args.confidence,
    args.signal,
    args.sortBy,
    args.sortDir,
  ]);

  const meta = useMemo(() => {
    if (mockEnabled && mockQuery.data?.length) {
      const pairs = Array.from(
        new Set(mockQuery.data.map((o) => o.pair)),
      ).sort();
      return {
        total: mockQuery.data.length,
        availablePairs: pairs,
        refresh_interval_ms: undefined as number | undefined,
      };
    }
    return apiPage?.raw.meta;
  }, [mockEnabled, mockQuery.data, apiPage]);

  const pagination = useMemo(() => {
    if (mockEnabled) {
      return {
        hasMore: false,
        nextCursor: undefined as string | undefined,
        pageSize: effectivePageSize,
      };
    }
    const p = apiPage?.raw.pagination;
    return {
      hasMore: p?.hasMore ?? false,
      nextCursor: p?.nextCursor ?? undefined,
      pageSize: p?.pageSize ?? effectivePageSize,
    };
  }, [mockEnabled, apiPage, effectivePageSize]);

  const isLoading = mockEnabled ? mockQuery.isLoading : apiQuery.isLoading;

  const isFetching = mockEnabled ? mockQuery.isFetching : apiQuery.isFetching;

  const isError = mockEnabled ? mockQuery.isError : apiQuery.isError;

  const error = mockEnabled ? mockQuery.error : apiQuery.error;

  const refetch = mockEnabled ? mockQuery.refetch : apiQuery.refetch;

  return {
    flatOpportunities,
    meta,
    pagination,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    usingFallback: false,
    mockEnabled,
  };
}
