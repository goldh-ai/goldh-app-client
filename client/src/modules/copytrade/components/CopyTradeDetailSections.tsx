import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { CopyTradeTraderDetail } from "../lib/copyTradeDetail";
import type {
  CopyTradePerformancePoint,
  CopyTradeScoreTrendPoint,
} from "../lib/copyTradeHistoryTransforms";
import {
  CopyTradeDetailColumnHeader,
  CopyTradeDetailInsightPanel,
} from "./CopyTradeDetailInsightPanel";
import {
  BehavioralTagsBlock,
  PerformanceChartBlock,
  RiskProfileBlock,
  ScoreDriversBlock,
  ScoreTrendChartBlock,
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

function InsightColumn({ header, body }: { header: ReactNode; body: ReactNode }) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">{header}</div>
      <div className="mt-3 flex min-h-0 flex-1 flex-col">{body}</div>
    </div>
  );
}

function RangeToggle<T extends string | number>({
  value,
  onChange,
  options,
  format,
}: {
  value: T;
  onChange: (next: T) => void;
  options: readonly T[];
  format: (key: T) => string;
}) {
  return (
    <div className="inline-flex rounded-lg border border-border/60 bg-background/60 p-0.5 shadow-inner shadow-black/20">
      {options.map((key) => (
        <button
          key={String(key)}
          type="button"
          onClick={() => onChange(key)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider transition",
            value === key
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {format(key)}
        </button>
      ))}
    </div>
  );
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
    <div className="space-y-4">
      <CopyTradeDetailInsightPanel
        eyebrow="Trajectory"
        left={
          <>
            <CopyTradeDetailColumnHeader
              title="Is the score consistent?"
              subtitle="Score trend over the selected window"
              right={
                <RangeToggle
                  value={scoreRange}
                  onChange={setScoreRange}
                  options={[30, 90] as const}
                  format={(d) => `${d}d`}
                />
              }
            />
            <div className="mt-3">
              <ScoreTrendChartBlock
                points={scorePoints}
                isLoading={isHistoryFetching}
                hasError={scoreErr}
                stability={detail.scoreStability}
              />
            </div>
          </>
        }
        right={
          <>
            <CopyTradeDetailColumnHeader
              title="How have they performed?"
              subtitle="Equity curve from cumulative ROI"
              right={
                <RangeToggle
                  value={perfRange}
                  onChange={setPerfRange}
                  options={["30d", "90d", "all"] as const}
                  format={(k) => (k === "all" ? "All" : k.toUpperCase())}
                />
              }
            />
            <div className="mt-3">
              <PerformanceChartBlock
                points={perfPoints}
                isLoading={isHistoryFetching}
                hasError={perfErr}
              />
            </div>
          </>
        }
      />

      <CopyTradeDetailInsightPanel
        balanceColumnHeights
        eyebrow="Explainability & risk"
        left={
          <InsightColumn
            header={
              <CopyTradeDetailColumnHeader
                title="Why this grade?"
                subtitle="Top contributors to the score"
              />
            }
            body={<ScoreDriversBlock detail={detail} fillHeight />}
          />
        }
        right={
          <InsightColumn
            header={
              <CopyTradeDetailColumnHeader
                title="Should I worry about losses?"
                subtitle="Drawdown, win rate, and overall risk"
              />
            }
            body={<RiskProfileBlock detail={detail} fillHeight />}
          />
        }
      />

      <CopyTradeDetailInsightPanel
        balanceColumnHeights
        eyebrow="Rhythm & style"
        left={
          <InsightColumn
            header={
              <CopyTradeDetailColumnHeader
                title="Are they active enough?"
                subtitle="Trade volume, tenure, and stated style"
              />
            }
            body={<TradingActivityBlock detail={detail} fillHeight />}
          />
        }
        right={
          <InsightColumn
            header={
              <CopyTradeDetailColumnHeader
                title="How do they trade?"
                subtitle="Profile type and behavioral tags"
              />
            }
            body={<BehavioralTagsBlock detail={detail} fillHeight />}
          />
        }
      />
    </div>
  );
}
