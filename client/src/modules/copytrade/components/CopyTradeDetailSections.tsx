import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { CopyTradeTraderDetail } from "../lib/copyTradeDetail";
import type {
  CopyTradePerformancePoint,
  CopyTradeScoreTrendPoint,
} from "../lib/copyTradeHistoryTransforms";
import {
  BehavioralTagsBlock,
  PerformanceChartBlock,
  RiskProfileBlock,
  ScoreDriversBlock,
  ScoreTrendChartBlock,
  SectionShell,
  TradingActivityBlock,
} from "./copyTradeDetailSections/index";

function pickScoreTrend(
  detail: CopyTradeTraderDetail,
  range: 30 | 90,
): CopyTradeScoreTrendPoint[] {
  const live = range === 30 ? detail.scoreTrend30 : detail.scoreTrend90;
  if (live && live.length > 1) return live;
  return [];
}

function pickPerformance(
  detail: CopyTradeTraderDetail,
  range: "30d" | "90d" | "all",
): CopyTradePerformancePoint[] {
  if (range === "30d")
    return detail.performance30 && detail.performance30.length > 1
      ? detail.performance30
      : [];
  if (range === "90d")
    return detail.performance90 && detail.performance90.length > 1
      ? detail.performance90
      : [];
  if (range === "all")
    return detail.performance365 && detail.performance365.length > 1
      ? detail.performance365
      : [];
  return [];
}


export type CopyTradeDetailSectionsProps = {
  detail: CopyTradeTraderDetail;
  isHistoryFetching: boolean;
  historyError30: boolean;
  historyError90: boolean;
  historyError365: boolean;
};

export function CopyTradeDetailSections({
  detail,
  isHistoryFetching,
  historyError30,
  historyError90,
  historyError365,
}: CopyTradeDetailSectionsProps) {
  const [scoreRange, setScoreRange] = useState<30 | 90>(30);
  const [perfRange, setPerfRange] = useState<"30d" | "90d" | "all">("30d");

  const scorePoints = useMemo(
    () => pickScoreTrend(detail, scoreRange),
    [detail, scoreRange],
  );
  const perfPoints = useMemo(
    () => pickPerformance(detail, perfRange),
    [detail, perfRange],
  );

  const scoreErr = scoreRange === 30 ? historyError30 : historyError90;
  const perfErr =
    perfRange === "30d"
      ? historyError30
      : perfRange === "90d"
        ? historyError90
        : historyError365;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        <SectionShell
          title="Score trend"
          subtitle="Last 30 / 90 days"
          right={
            <div className="inline-flex rounded-md border border-border bg-muted/40 p-0.5">
              {([30, 90] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setScoreRange(d)}
                  className={cn(
                    "rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider",
                    scoreRange === d
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {d}d
                </button>
              ))}
            </div>
          }
        >
          <ScoreTrendChartBlock
            points={scorePoints}
            isLoading={isHistoryFetching}
            hasError={scoreErr}
          />
        </SectionShell>

        <SectionShell
          title="Performance history"
          subtitle="Profit/equity curve over time"
          right={
            <div className="inline-flex rounded-md border border-border bg-muted/40 p-0.5">
              {(["30d", "90d", "all"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setPerfRange(k)}
                  className={cn(
                    "rounded px-2 py-1 text-xs font-bold uppercase tracking-wider",
                    perfRange === k
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {k === "all" ? "All" : k.toUpperCase()}
                </button>
              ))}
            </div>
          }
        >
          <PerformanceChartBlock
            points={perfPoints}
            isLoading={isHistoryFetching}
            hasError={perfErr}
          />
        </SectionShell>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        <SectionShell
          title="Why this score"
          subtitle="Simple explanation of grade and confidence"
        >
          <ScoreDriversBlock detail={detail} />
        </SectionShell>

        <SectionShell
          title="Risk assessment"
          subtitle="Essential risk checks only"
        >
          <RiskProfileBlock detail={detail} />
        </SectionShell>
      </div>

      <SectionShell
        title="Trading activity"
        subtitle="Cadence and stated style"
      >
        <TradingActivityBlock detail={detail} />
      </SectionShell>

      <SectionShell
        title="Behavioral tags"
        subtitle="Strategy style, activity signals, and risk posture"
      >
        <BehavioralTagsBlock detail={detail} />
      </SectionShell>

      <details className="rounded-xl border border-border bg-card/70 px-3 py-2">
        <summary className="cursor-pointer list-none text-xs font-bold uppercase tracking-wider text-muted-foreground">
          More context
        </summary>
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg border border-border bg-card px-2.5 py-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Profile type
              </p>
              <p className="mt-1 font-semibold text-foreground">
                {detail.strategyLabel ?? "General"}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card px-2.5 py-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Rank
              </p>
              <p className="mt-1 font-semibold text-foreground">
                #{detail.computedRank}
              </p>
            </div>
          </div>
          {detail.behavioralTags && detail.behavioralTags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {detail.behavioralTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {detail.subscores.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {detail.subscores.slice(0, 9).map((m) => (
                <div
                  key={m.label}
                  className="rounded-lg border border-border bg-card px-2 py-2 text-center"
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    {m.label}
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold text-foreground">
                    {m.value}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </details>
    </div>
  );
}
