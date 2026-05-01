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
      {/* Score story — chart + drivers, paired so the user can see "is it stable" and "why" together. */}
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        <SectionShell
          title="Is the score consistent?"
          subtitle="Score trend over the selected window"
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
            stability={detail.scoreStability}
          />
        </SectionShell>

        <SectionShell
          title="How have they performed?"
          subtitle="Equity curve from cumulative ROI"
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
          title="Why this grade?"
          subtitle="Top contributors to the score"
        >
          <ScoreDriversBlock detail={detail} />
        </SectionShell>

        <SectionShell
          title="Should I worry about losses?"
          subtitle="Drawdown, win rate, and overall risk"
        >
          <RiskProfileBlock detail={detail} />
        </SectionShell>
      </div>

      <SectionShell
        title="Are they active enough?"
        subtitle="Trade volume, tenure, and stated style"
      >
        <TradingActivityBlock detail={detail} />
      </SectionShell>

      <SectionShell
        title="How do they trade?"
        subtitle="Profile type and behavioral tags"
      >
        <BehavioralTagsBlock detail={detail} />
      </SectionShell>
    </div>
  );
}
