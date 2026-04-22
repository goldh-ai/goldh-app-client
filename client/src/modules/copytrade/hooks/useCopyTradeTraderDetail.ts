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
} from "../lib/copyTradeApi";

type UseCopyTradeTraderDetailArgs = {
  traderId?: string | null;
  baseTrader?: CopyTradeTrader;
  enabled: boolean;
};

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

  const detail = useMemo(() => {
    if (!query.data) return undefined;
    return {
      ...query.data,
      history30d:
        history30Query.data && history30Query.data.length > 0
          ? history30Query.data
          : query.data.history30d,
      history90d:
        history90Query.data && history90Query.data.length > 0
          ? history90Query.data
          : query.data.history90d,
    } satisfies CopyTradeTraderDetail;
  }, [query.data, history30Query.data, history90Query.data]);

  const mockHistory30 = mockEnabled ? detail?.history30d : undefined;
  const mockHistory90 = mockEnabled ? detail?.history90d : undefined;

  return {
    detail,
    isLoading: query.isLoading,
    isFetching:
      query.isFetching ||
      history30Query.isFetching ||
      history90Query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: async () => {
      await query.refetch();
      await Promise.all([history30Query.refetch(), history90Query.refetch()]);
    },
    history30: mockHistory30 ?? history30Query.data,
    history90: mockHistory90 ?? history90Query.data,
    history30Error: mockEnabled ? undefined : history30Query.error,
    history90Error: mockEnabled ? undefined : history90Query.error,
  };
}
