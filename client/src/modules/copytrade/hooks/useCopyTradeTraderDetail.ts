import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { CopyTradeTrader } from "@shared/types";
import { isCopyTradeMockEnabled } from "@/lib/copyTradeMock";
import {
  buildCopyTradeDetailFromPayload,
  type CopyTradeTraderDetail,
} from "../lib/copyTradeDetail";
import {
  fetchCopyTradeTraderDetail,
  fetchCopyTradeTraderHistory,
  mergeCopyTradeHistoryIntoDetail,
} from "../lib/copyTradeApi";
import type { CopyTradeScoreTrendPoint } from "../lib/copyTradeHistoryTransforms";
import { historyRecordsToScoreTrend } from "../lib/copyTradeHistoryTransforms";

type UseCopyTradeTraderDetailArgs = {
  traderId?: string | null;
  baseTrader?: CopyTradeTrader;
  enabled: boolean;
};

function numericHistoryToTrend(scores: number[]): CopyTradeScoreTrendPoint[] {
  const out: CopyTradeScoreTrendPoint[] = [];
  const end = new Date();
  for (let i = 0; i < scores.length; i++) {
    const d = new Date(end);
    d.setUTCDate(d.getUTCDate() - (scores.length - 1 - i));
    out.push({
      date: d.toISOString().slice(0, 10),
      score: scores[i]!,
    });
  }
  return out;
}

function mergeMockChartDetail(
  base: CopyTradeTraderDetail,
): CopyTradeTraderDetail {
  const t30 = numericHistoryToTrend(base.history30d);
  const t90 = numericHistoryToTrend(base.history90d);
  return {
    ...base,
    scoreTrend30: t30,
    scoreTrend90: t90,
    scoreTrend365: t90.length > 0 ? t90 : t30,
  };
}

export function useCopyTradeTraderDetail(args: UseCopyTradeTraderDetailArgs) {
  const mockEnabled = isCopyTradeMockEnabled();

  const query = useQuery({
    queryKey: ["copytrade", "trader-detail", args.traderId],
    enabled: args.enabled && Boolean(args.traderId),
    queryFn: async (): Promise<CopyTradeTraderDetail> => {
      if (!args.traderId) {
        throw new Error("Trader id is required");
      }
      if (mockEnabled) {
        const { COPYTRADE_MOCK_TRADERS_DTO } =
          await import("@/mock/copytrade.mock");
        const dto = COPYTRADE_MOCK_TRADERS_DTO.find(
          (t) => t.trader_id === args.traderId,
        );
        if (!dto) throw new Error("Mock trader not found");
        return buildCopyTradeDetailFromPayload(dto, args.baseTrader);
      }
      return fetchCopyTradeTraderDetail(args.traderId, args.baseTrader);
    },
    staleTime: 30_000,
  });

  const history30Query = useQuery({
    queryKey: ["copytrade", "trader-history", args.traderId, 30],
    enabled: args.enabled && Boolean(args.traderId) && !mockEnabled,
    queryFn: async () => {
      if (!args.traderId) throw new Error("Trader id is required");
      return fetchCopyTradeTraderHistory(args.traderId, 30);
    },
    staleTime: 30_000,
    retry: 1,
  });

  const history90Query = useQuery({
    queryKey: ["copytrade", "trader-history", args.traderId, 90],
    enabled: args.enabled && Boolean(args.traderId) && !mockEnabled,
    queryFn: async () => {
      if (!args.traderId) throw new Error("Trader id is required");
      return fetchCopyTradeTraderHistory(args.traderId, 90);
    },
    staleTime: 30_000,
    retry: 1,
  });

  const history365Query = useQuery({
    queryKey: ["copytrade", "trader-history", args.traderId, 365],
    enabled: args.enabled && Boolean(args.traderId) && !mockEnabled,
    queryFn: async () => {
      if (!args.traderId) throw new Error("Trader id is required");
      return fetchCopyTradeTraderHistory(args.traderId, 365);
    },
    staleTime: 60_000,
    retry: 1,
  });

  const detail = useMemo(() => {
    if (!query.data) return undefined;
    if (mockEnabled) {
      return mergeMockChartDetail(query.data);
    }
    return mergeCopyTradeHistoryIntoDetail(
      query.data,
      history30Query.data ?? [],
      history90Query.data ?? [],
      history365Query.data ?? [],
    );
  }, [
    mockEnabled,
    query.data,
    history30Query.data,
    history90Query.data,
    history365Query.data,
  ]);

  const mockHistory30 = mockEnabled
    ? detail?.history30d
    : history30Query.data?.length
      ? historyRecordsToScoreTrend(history30Query.data, "ema_score").map(
          (p) => p.score,
        )
      : undefined;
  const mockHistory90 = mockEnabled
    ? detail?.history90d
    : history90Query.data?.length
      ? historyRecordsToScoreTrend(history90Query.data, "ema_score").map(
          (p) => p.score,
        )
      : undefined;

  return {
    detail,
    isLoading: query.isLoading,
    isFetching:
      query.isFetching ||
      history30Query.isFetching ||
      history90Query.isFetching ||
      history365Query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: async () => {
      await query.refetch();
      await Promise.all([
        history30Query.refetch(),
        history90Query.refetch(),
        history365Query.refetch(),
      ]);
    },
    history30: mockHistory30 ?? history30Query.data?.map((r) => r.ema_score),
    history90: mockHistory90 ?? history90Query.data?.map((r) => r.ema_score),
    history30Error: mockEnabled ? undefined : history30Query.error,
    history90Error: mockEnabled ? undefined : history90Query.error,
    history365Error: mockEnabled ? undefined : history365Query.error,
  };
}
