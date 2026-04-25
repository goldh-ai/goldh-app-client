import type {
  CopyTradeConfidenceBand,
  CopyTradeGrade,
  CopyTradeSignalState,
} from "@shared/types";
import { cn } from "@/lib/utils";
import { fmtCopyTradeUpdated } from "../../lib/copyTradeFormat";
import type { CopyTradeTraderDetail } from "../../lib/copyTradeDetail";
import {
  CopyTradeCapacityBadge,
  CopyTradeConfidenceBadge,
  CopyTradeGradeBadge,
  CopyTradeSignalBadge,
  getCopyTradeProfileVisual,
} from "../../lib/copyTradeBadges";
import {
  COPYTRADE_RECOMMENDED_ACTION_LABEL,
  getCopyTradeRecommendedAction,
} from "../../lib/copyTradeRecommendedAction";
import { CloseCorner } from "./CloseCorner";

type CopyTraderDetailStickyHeaderProps = {
  onClose: () => void;
  handle: string;
  traderId: string;
  grade: CopyTradeGrade;
  confidenceBand: CopyTradeConfidenceBand;
  signalState: CopyTradeSignalState;
  capacityFlag: CopyTradeTraderDetail["capacityFlag"] | null | undefined;
  lastUpdatedIso: string;
  monthsActive?: number | null;
  totalTrades?: number | null;
  profileTag?: string | null;
  score: number;
  momentum: number;
  computedRank: number;
};

export function CopyTraderDetailStickyHeader({
  onClose,
  handle,
  traderId,
  grade,
  confidenceBand,
  signalState,
  capacityFlag,
  lastUpdatedIso,
  monthsActive,
  totalTrades,
  profileTag,
  score,
  momentum,
  computedRank,
}: CopyTraderDetailStickyHeaderProps) {
  const profileVisual = getCopyTradeProfileVisual(profileTag);
  const action = getCopyTradeRecommendedAction(grade, confidenceBand);
  const actionLabel = COPYTRADE_RECOMMENDED_ACTION_LABEL[action];
  const actionClass =
    action === "FOLLOW"
      ? "border-emerald-500/50 bg-emerald-600/20 text-emerald-300"
      : action === "AVOID"
        ? "border-rose-500/50 bg-rose-600/20 text-rose-300"
        : action === "SELECTIVE"
          ? "border-amber-500/50 bg-amber-500/20 text-amber-200"
          : "border-orange-500/50 bg-orange-500/20 text-orange-200";
  const actionPrefix = action === "AVOID" ? "✗" : "✓";
  const recommendationReason = `Grade ${grade} with ${confidenceBand} confidence`;
  const activitySummary =
    monthsActive != null && totalTrades != null
      ? `${monthsActive}mo active · ${totalTrades} trades`
      : monthsActive != null
        ? `${monthsActive}mo active`
        : totalTrades != null
          ? `${totalTrades} trades`
          : "Track record building";

  return (
    <header className="sticky top-0 z-20 shrink-0 border-b border-border bg-background/95 px-5 pb-4 pt-4 backdrop-blur-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-widest text-primary">
            Trader Intelligence
          </p>
          <h3 className="mt-0.5 truncate text-xl font-black text-foreground">
            {handle}
          </h3>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {traderId}
          </p>
        </div>
        <CloseCorner onClose={onClose} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <CopyTradeGradeBadge grade={grade} />
        <CopyTradeConfidenceBadge band={confidenceBand} />
        <CopyTradeSignalBadge state={signalState} />
        <CopyTradeCapacityBadge capacity={capacityFlag ?? null} />
      </div>

      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Recommended action
        </p>
        <div className={cn("mt-2 rounded-xl border px-3 py-2.5", actionClass)}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-lg font-black leading-none tracking-tight sm:text-xl">
                {actionPrefix} {actionLabel}
              </p>
              <p className="mt-1.5 text-xs font-semibold">{recommendationReason}</p>
              <p className="mt-0.5 text-xs opacity-90">{activitySummary}</p>
            </div>
            <div className="shrink-0 space-y-1.5 pr-1 text-right">
              <div>
                <p className="text-xs uppercase tracking-wide text-foreground/70">Rank</p>
                <p className="mt-0.5 font-mono text-xs font-semibold text-foreground">#{computedRank}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-foreground/70">Score</p>
                <p className="mt-0.5 font-mono text-xs font-semibold text-foreground">{score.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-foreground/70">Momentum</p>
                <p className="mt-0.5 font-mono text-xs font-semibold text-foreground">{momentum.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Strategy: <span className="font-medium text-foreground">{profileVisual.label}</span>
            </p>
            <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
              {fmtCopyTradeUpdated(lastUpdatedIso)}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
