import { ShieldAlert } from "lucide-react";
import type {
  CopyTradeCapacityFlag,
  CopyTradeConfidenceBand,
  CopyTradeGrade,
  CopyTradeLifecycleState,
  CopyTradeSignalState,
} from "@shared/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  fmtCopyTradeMomentum,
  fmtCopyTradeScore,
  fmtCopyTradeUpdated,
} from "../../lib/copyTradeFormat";
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
  type CopyTradeRecommendedAction,
} from "../../lib/copyTradeRecommendedAction";
import { CloseCorner } from "./CloseCorner";

function HeaderClassificationPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="inline-flex h-7 w-full min-w-0 shrink-0 items-center justify-center rounded-md border border-dashed border-border bg-muted/25 text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground"
      aria-label={`No ${label.toLowerCase()} info available`}
    >
      —
    </div>
  );
}

type CopyTraderDetailStickyHeaderProps = {
  onClose: () => void;
  handle: string;
  traderId: string;
  grade?: CopyTradeGrade;
  confidenceBand?: CopyTradeConfidenceBand;
  signalState?: CopyTradeSignalState;
  lifecycleState?: CopyTradeLifecycleState | null;
  capacityFlag: CopyTradeTraderDetail["capacityFlag"] | null | undefined;
  lastUpdatedIso: string;
  monthsActive?: number | null;
  totalTrades?: number | null;
  profileTag?: string | null;
  score: number;
  momentum: number;
  computedRank: number;
  scoreCapApplied?: boolean;
};

const actionTone: Record<
  CopyTradeRecommendedAction,
  { surface: string; rule: string; symbol: string }
> = {
  FOLLOW: {
    surface: "border-emerald-500/55 bg-emerald-500/15 text-emerald-300",
    rule: "text-emerald-200/90",
    symbol: "✓",
  },
  SELECTIVE: {
    surface: "border-amber-400/55 bg-amber-400/15 text-amber-200",
    rule: "text-amber-100/90",
    symbol: "◎",
  },
  MONITOR: {
    surface: "border-muted-foreground/45 bg-muted/40 text-foreground",
    rule: "text-muted-foreground",
    symbol: "○",
  },
  AVOID: {
    surface: "border-rose-500/55 bg-rose-500/15 text-rose-300",
    rule: "text-rose-200/90",
    symbol: "✗",
  },
};

function MetricCell({
  label,
  value,
  tone,
  className,
}: {
  label: string;
  value: string;
  tone?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-start", className)}>
      <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          "mt-1 font-mono text-base font-bold tabular-nums leading-none text-foreground",
          tone,
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function CopyTraderDetailStickyHeader({
  onClose,
  handle,
  traderId,
  grade,
  confidenceBand,
  signalState,
  lifecycleState,
  capacityFlag,
  lastUpdatedIso,
  monthsActive,
  totalTrades,
  profileTag,
  score,
  momentum,
  computedRank,
  scoreCapApplied,
}: CopyTraderDetailStickyHeaderProps) {
  const profileVisual = getCopyTradeProfileVisual(profileTag);
  const canRecommend = Boolean(grade && confidenceBand);
  const recommendation = canRecommend
    ? getCopyTradeRecommendedAction({
      grade: grade!,
      confidenceBand: confidenceBand!,
      signalState,
      lifecycleState: lifecycleState ?? undefined,
      capacityFlag: capacityFlag ?? undefined,
    })
    : null;
  const action = recommendation?.action;
  const reason = recommendation?.reason;
  const actionLabel = action ? COPYTRADE_RECOMMENDED_ACTION_LABEL[action] : "";
  const tone = action ? actionTone[action] : null;

  const activitySummary =
    monthsActive != null && totalTrades != null
      ? `${monthsActive}mo · ${totalTrades} trades`
      : monthsActive != null
        ? `${monthsActive}mo active`
        : totalTrades != null
          ? `${totalTrades} trades`
          : "—";

  const momentumTone =
    momentum > 0
      ? "text-emerald-400"
      : momentum < 0
        ? "text-rose-400"
        : "text-foreground";

  return (
    <header className="sticky top-0 z-20 shrink-0 border-b border-border/80 bg-background/90 px-5 pb-4 pt-4 shadow-sm shadow-black/10 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-primary">
            Trader Intelligence
          </p>
          <div className="mt-0.5 flex items-center gap-2">
            <h3 className="truncate text-xl font-black text-foreground">
              {handle}
            </h3>
            <span
              className={cn(
                "shrink-0 rounded-full border px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-widest",
                profileVisual.className,
              )}
              title={profileVisual.description}
            >
              {profileVisual.icon} {profileVisual.shortLabel}
            </span>
          </div>
          <p className="mt-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {traderId}
          </p>
        </div>
        <CloseCorner onClose={onClose} />
      </div>

      {/* Decision hero — only when grade + confidence exist; never infer from defaults. */}
      {canRecommend && recommendation && tone && action ? (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "relative mt-3 cursor-default overflow-hidden rounded-2xl border px-3 py-3 shadow-md shadow-black/20 transition sm:px-4 sm:py-3.5",
                  tone.surface,
                )}
                role="status"
                aria-label={`Recommended action: ${actionLabel}`}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent"
                />
                <div className="relative flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.22em] opacity-80">
                      Recommended action
                    </p>
                    <p className="mt-1 text-2xl font-black leading-none tracking-tight">
                      {tone.symbol} {actionLabel}
                    </p>
                    <p className={cn("mt-1.5 text-xs leading-snug", tone.rule)}>
                      {reason}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.22em] opacity-80">
                      Updated
                    </p>
                    <p className="mt-1 font-mono text-[0.7rem] font-semibold leading-tight">
                      {fmtCopyTradeUpdated(lastUpdatedIso)}
                    </p>
                    <p className="mt-1 text-[0.65rem] font-medium opacity-80">
                      {activitySummary}
                    </p>
                  </div>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="max-w-xs border border-border bg-popover text-xs text-popover-foreground"
            >
              <span className="block font-bold uppercase tracking-wider text-foreground">
                {actionLabel}
              </span>
              <span className="mt-1 block text-muted-foreground">{reason}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div
          className="mt-3 rounded-2xl border border-dashed border-border/60 bg-muted/10 px-3 py-3 text-xs text-muted-foreground sm:px-4 sm:py-3.5"
          role="status"
          aria-label="No recommendation info available"
        >
          <p className="font-bold uppercase tracking-[0.18em] text-muted-foreground/90">
            Recommended action
          </p>
          <p className="mt-1.5 leading-snug">
            No recommendation available yet. We show one when grade and confidence are both available for
            this trader.
          </p>
          <div className="mt-3 flex flex-wrap justify-end gap-x-4 gap-y-1 border-t border-border/40 pt-2.5 text-right text-[0.65rem] text-muted-foreground/90">
            <span className="font-bold uppercase tracking-[0.15em]">Updated</span>
            <span className="font-mono font-semibold tabular-nums text-foreground/90">
              {fmtCopyTradeUpdated(lastUpdatedIso)}
            </span>
            <span className="w-full text-[0.65rem] opacity-90 sm:w-auto">{activitySummary}</span>
          </div>
        </div>
      )}

      {/* Compact metric strip — single row, no triple-stacked corner. */}
      <div className="mt-3 grid grid-cols-3 divide-x divide-border/45 overflow-hidden rounded-xl bg-muted/10 py-1 ring-1 ring-inset ring-border/35">
        <MetricCell
          className="px-3 py-2.5"
          label="Rank"
          value={`#${computedRank}`}
        />
        <MetricCell className="px-3 py-2.5" label="Score" value={fmtCopyTradeScore(score)} />
        <MetricCell
          className="px-3 py-2.5"
          label="Momentum"
          value={fmtCopyTradeMomentum(momentum)}
          tone={momentumTone}
        />
      </div>

      {scoreCapApplied ? (
        <div className="mt-2 flex items-center gap-2 rounded-md border border-amber-500/35 bg-amber-500/10 px-3 py-1.5 text-[0.7rem] font-semibold text-amber-200">
          <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
          Score capped by guardrail rule (e.g. drawdown limit).
        </div>
      ) : null}

      {/* Status chips — grade / confidence / signal / capacity (no invented enum values). */}
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {grade ? (
          <CopyTradeGradeBadge grade={grade} />
        ) : (
          <HeaderClassificationPlaceholder label="Grade" />
        )}
        {confidenceBand ? (
          <CopyTradeConfidenceBadge band={confidenceBand} />
        ) : (
          <HeaderClassificationPlaceholder label="Confidence" />
        )}
        {signalState ? (
          <CopyTradeSignalBadge state={signalState} />
        ) : (
          <HeaderClassificationPlaceholder label="Signal" />
        )}
        <CopyTradeCapacityBadge capacity={capacityFlag ?? null} />
      </div>
    </header>
  );
}
