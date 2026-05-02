import { Sparkles, ShieldAlert, RefreshCw } from "lucide-react";
import type { CopyTradeTrader } from "@shared/types";
import { Button } from "@/components/ui/button";
import type { CopyTradeTraderDetail } from "../lib/copyTradeDetail";
import { CopyTradeDetailSections } from "./CopyTradeDetailSections";
import {
  CloseCorner,
  CopyTraderDetailStickyHeader,
} from "./copyTradeDetailPanel/index";

export type CopyTradeDetailPanelProps = {
  selectedTrader?: CopyTradeTrader;
  detail?: CopyTradeTraderDetail;
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  onRetry: () => void;
  onClose: () => void;
  isHistoryFetching?: boolean;
  hasHistoryError30?: boolean;
  hasHistoryError90?: boolean;
  hasHistoryError365?: boolean;
};

export function CopyTradeDetailPanel({
  selectedTrader,
  detail,
  isLoading,
  isError,
  error,
  onRetry,
  onClose,
  isHistoryFetching = false,
  hasHistoryError30 = false,
  hasHistoryError90 = false,
  hasHistoryError365 = false,
}: CopyTradeDetailPanelProps) {
  if (!selectedTrader) {
    return (
      <aside className="flex h-full flex-col overflow-hidden rounded-none border-l border-border bg-gradient-to-b from-card to-background">
        <div className="flex shrink-0 items-center justify-end border-b border-border px-5 py-3">
          <CloseCorner onClose={onClose} />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" />
            <p className="text-xs font-black uppercase tracking-wider">Detail Console</p>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Select any trader row to open the intelligence panel with recommendation, confidence signals, and risk
            context.
          </p>
        </div>
      </aside>
    );
  }

  const headerSource = detail ?? selectedTrader;
  const headerTimestamp =
    detail?.generatedAt && detail.generatedAt.trim().length > 0
      ? detail.generatedAt
      : headerSource.lastSeenAt;

  if (isError) {
    return (
      <aside className="flex h-full flex-col overflow-hidden rounded-none border-l border-rose-500/30 bg-rose-500/10">
        <CopyTraderDetailStickyHeader
          onClose={onClose}
          handle={headerSource.handle}
          traderId={headerSource.traderId}
          grade={headerSource.grade}
          confidenceBand={headerSource.confidenceBand}
          signalState={headerSource.signalState}
          lifecycleState={headerSource.lifecycleState}
          capacityFlag={headerSource.capacityFlag}
          lastUpdatedIso={headerTimestamp}
          monthsActive={detail?.monthsActiveProfile}
          totalTrades={detail?.totalTradesProfile}
          profileTag={headerSource.profileTag}
          score={headerSource.score}
          momentum={headerSource.momentum}
          computedRank={headerSource.computedRank}
          scoreCapApplied={detail?.scoreCapApplied}
        />
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="flex items-center gap-2 text-rose-300">
            <ShieldAlert className="h-4 w-4" />
            <p className="text-xs font-black uppercase tracking-wider">Detail Error</p>
          </div>
          <p className="mt-3 text-xs text-rose-200">
            {error instanceof Error ? error.message : "Could not load trader detail."}
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="mt-3 border-rose-300/40 text-rose-200 hover:bg-rose-500/20"
            onClick={onRetry}
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Retry
          </Button>
        </div>
      </aside>
    );
  }

  if (isLoading || !detail) {
    return (
      <aside className="flex h-full flex-col overflow-hidden rounded-none border-l border-border bg-background/95">
        <CopyTraderDetailStickyHeader
          onClose={onClose}
          handle={selectedTrader.handle}
          traderId={selectedTrader.traderId}
          grade={selectedTrader.grade}
          confidenceBand={selectedTrader.confidenceBand}
          signalState={selectedTrader.signalState}
          lifecycleState={selectedTrader.lifecycleState}
          capacityFlag={selectedTrader.capacityFlag}
          lastUpdatedIso={selectedTrader.lastSeenAt}
          monthsActive={null}
          totalTrades={null}
          profileTag={selectedTrader.profileTag}
          score={selectedTrader.score}
          momentum={selectedTrader.momentum}
          computedRank={selectedTrader.computedRank}
        />
        <div
          className="min-h-0 flex-1 overflow-y-auto p-5"
          aria-busy="true"
          aria-live="polite"
        >
          <span className="sr-only">Loading trader detail</span>
          <div className="space-y-3">
            <div className="h-52 animate-pulse rounded-xl bg-muted/40" />
            <div className="h-32 animate-pulse rounded-xl bg-muted/40" />
            <div className="h-40 animate-pulse rounded-xl bg-muted/40" />
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex h-full flex-col overflow-hidden rounded-none border-l border-border bg-gradient-to-b from-card to-background shadow-2xl">
      <CopyTraderDetailStickyHeader
        onClose={onClose}
        handle={detail.handle}
        traderId={detail.traderId}
        grade={detail.grade ?? selectedTrader?.grade}
        confidenceBand={detail.confidenceBand ?? selectedTrader?.confidenceBand}
        signalState={detail.signalState ?? selectedTrader?.signalState}
        lifecycleState={detail.lifecycleState ?? selectedTrader?.lifecycleState}
        capacityFlag={detail.capacityFlag}
        lastUpdatedIso={headerTimestamp}
        monthsActive={detail.monthsActiveProfile}
        totalTrades={detail.totalTradesProfile}
        profileTag={detail.profileTag}
        score={detail.score}
        momentum={detail.momentum}
        computedRank={detail.computedRank}
        scoreCapApplied={detail.scoreCapApplied}
      />

      <div className="min-h-0 flex-1 overflow-y-auto bg-[radial-gradient(ellipse_85%_50%_at_50%_-8%,hsl(var(--primary)/0.09),transparent_58%)] px-5 pb-10 pt-5">
        <CopyTradeDetailSections
          detail={detail}
          isHistoryFetching={isHistoryFetching}
          historyError30={hasHistoryError30}
          historyError90={hasHistoryError90}
          historyError365={hasHistoryError365}
        />
      </div>
    </aside>
  );
}
