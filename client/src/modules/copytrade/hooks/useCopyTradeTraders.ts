import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { CopyTradeSortByApi, PlanTier } from "@shared/types";
import { isCopyTradeMockEnabled } from "@/lib/copyTradeMock";
import { fetchCopyTradeLeaderboard } from "../lib/copyTradeApi";
import { sortCopyTradeTradersForDisplay } from "../lib/copyTradeSort";

type UseCopyTradeTradersArgs = {
  enabled: boolean;
  grade: string;
  confidence: string;
  signal: string;
  sortBy: CopyTradeSortByApi;
  planTier?: PlanTier | null;
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
    queryKey: ["copytrade", "v1", "leaderboard"],
    queryFn: fetchCopyTradeLeaderboard,
    enabled: args.enabled && !mockEnabled,
    retry: 2,
  });

  const sourceRows = useMemo(() => {
    if (mockEnabled) return mockQuery.data ?? [];
    return apiQuery.data?.traders ?? [];
  }, [mockEnabled, mockQuery.data, apiQuery.data]);

  const filteredRows = useMemo(() => {
    const rows = sourceRows.filter(
      (row) =>
        matchesFilter(row.grade, args.grade) &&
        matchesFilter(row.confidenceBand, args.confidence) &&
        matchesFilter(row.signalState, args.signal),
    );
    return sortCopyTradeTradersForDisplay(rows, args.sortBy);
  }, [sourceRows, args.grade, args.confidence, args.signal, args.sortBy]);

  const withTierCap = useMemo(() => {
    // Mock mode is intentionally uncapped for UI development realism.
    if (mockEnabled) return filteredRows;
    if (args.planTier === "free") return filteredRows.slice(0, 10);
    return filteredRows;
  }, [mockEnabled, args.planTier, filteredRows]);

  const isLoading = mockEnabled ? mockQuery.isLoading : apiQuery.isLoading;
  const isFetching = mockEnabled ? mockQuery.isFetching : apiQuery.isFetching;
  const isError = mockEnabled ? mockQuery.isError : apiQuery.isError;
  const error = mockEnabled ? mockQuery.error : apiQuery.error;
  const refetch = mockEnabled ? mockQuery.refetch : apiQuery.refetch;

  return {
    traders: withTierCap,
    totalAvailable: sourceRows.length,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    mockEnabled,
  };
}
