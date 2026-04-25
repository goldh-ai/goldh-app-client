import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { CopyTradeSortByApi } from "@shared/types";
import { isCopyTradeMockEnabled } from "@/lib/copyTradeMock";
import { fetchCopyTradeLeaderboard } from "../lib/copyTradeApi";
import { sortCopyTradeTradersForDisplay } from "../lib/copyTradeSort";

type UseCopyTradeTradersArgs = {
  enabled: boolean;
  grade: string;
  confidence: string;
  signal: string;
  capacity: string;
  sortBy: CopyTradeSortByApi;
  pageSize: number;
  cursor?: string | null;
};

function matchesFilter(value: string, filter: string): boolean {
  if (!filter || filter === "all") return true;
  return value === filter;
}

export function useCopyTradeTraders(args: UseCopyTradeTradersArgs) {
  const mockEnabled = isCopyTradeMockEnabled();

  const mockQuery = useQuery({
    queryKey: ["copytrade", "mock", "leaderboard"],
    queryFn: async () => {
      const { COPYTRADE_MOCK_TRADERS_DTO } =
        await import("@/mock/copytrade.mock");
      const { mapCopyTradeTraderFromApiDto } = await import("@shared/types");
      return COPYTRADE_MOCK_TRADERS_DTO.map(mapCopyTradeTraderFromApiDto);
    },
    enabled: args.enabled && mockEnabled,
    staleTime: 60_000,
  });

  const apiQuery = useQuery({
    queryKey: [
      "copytrade",
      "v1",
      "leaderboard",
      args.grade,
      args.confidence,
      args.signal,
      args.capacity,
      args.sortBy,
      args.pageSize,
      args.cursor ?? null,
    ],
    queryFn: () =>
      fetchCopyTradeLeaderboard({
        grade: args.grade,
        confidence: args.confidence,
        signal: args.signal,
        capacity: args.capacity,
        sortBy: args.sortBy,
        pageSize: args.pageSize,
        cursor: args.cursor ?? undefined,
      }),
    enabled: args.enabled && !mockEnabled,
    retry: 2,
  });

  const mockRows = useMemo(() => {
    const rows = (mockQuery.data ?? []).filter(
      (row) =>
        matchesFilter(row.grade, args.grade) &&
        matchesFilter(row.confidenceBand, args.confidence) &&
        matchesFilter(row.signalState, args.signal) &&
        (args.capacity === "all" || row.capacityFlag === args.capacity),
    );
    return sortCopyTradeTradersForDisplay(rows, args.sortBy);
  }, [
    mockQuery.data,
    args.grade,
    args.confidence,
    args.signal,
    args.capacity,
    args.sortBy,
  ]);

  const serverRows = apiQuery.data?.traders ?? [];
  const serverRaw = apiQuery.data?.raw;
  const traders = mockEnabled ? mockRows : serverRows;
  const totalAvailable = mockEnabled
    ? mockRows.length
    : (serverRaw?.trader_count ?? serverRaw?.meta?.total ?? serverRows.length);
  const nextCursor = mockEnabled
    ? undefined
    : (serverRaw?.pagination?.nextCursor ?? undefined);
  const hasMore = mockEnabled
    ? false
    : Boolean(
        serverRaw?.pagination?.hasMore ??
        (serverRaw?.pagination?.nextCursor &&
          serverRaw.pagination.nextCursor.length > 0),
      );
  const tierRestricted = mockEnabled
    ? false
    : Boolean(serverRaw?.meta?.tier_restricted);

  const isLoading = mockEnabled ? mockQuery.isLoading : apiQuery.isLoading;
  const isFetching = mockEnabled ? mockQuery.isFetching : apiQuery.isFetching;
  const isError = mockEnabled ? mockQuery.isError : apiQuery.isError;
  const error = mockEnabled ? mockQuery.error : apiQuery.error;
  const refetch = mockEnabled ? mockQuery.refetch : apiQuery.refetch;

  return {
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
  };
}
