import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { fmtCopyTradeScore } from "../../lib/copyTradeFormat";
import type {
  CopyTradeScoreStability,
  CopyTradeTraderDetail,
} from "../../lib/copyTradeDetail";
import type { CopyTradeScoreTrendPoint } from "../../lib/copyTradeHistoryTransforms";
import { formatShortDate } from "../../lib/copyTradeHistoryTransforms";

const CHART_ACCENT = "hsl(var(--primary))";
const CHART_GRID = "hsl(var(--border))";
const CHART_TICK = "hsl(var(--muted-foreground))";
const CHART_POPOVER_BG = "hsl(var(--popover))";
const CHART_BG = "hsl(var(--background))";

type ScoreTrendChartBlockProps = {
  points: CopyTradeScoreTrendPoint[];
  isLoading: boolean;
  hasError: boolean;
  stability?: CopyTradeTraderDetail["scoreStability"];
};

const STABILITY_TONE: Record<
  CopyTradeScoreStability,
  { dot: string; surface: string; label: string }
> = {
  stable: {
    dot: "bg-emerald-300",
    surface:
      "border-emerald-600/60 bg-emerald-950/90 text-emerald-50 shadow-sm dark:border-emerald-500/45",
    label: "Stable",
  },
  moderate: {
    dot: "bg-amber-300",
    surface:
      "border-amber-600/55 bg-amber-950/90 text-amber-50 shadow-sm dark:border-amber-500/40",
    label: "Moderate",
  },
  volatile: {
    dot: "bg-rose-300",
    surface: "border-rose-600/60 bg-rose-950/90 text-rose-50 shadow-sm dark:border-rose-500/45",
    label: "Volatile",
  },
};

export function ScoreTrendChartBlock({
  points,
  isLoading,
  hasError,
  stability,
}: ScoreTrendChartBlockProps) {
  const tickDates = useMemo(() => {
    if (points.length === 0) return [];
    return points
      .filter((_, i) => i % 5 === 0 || i === points.length - 1)
      .map((p) => p.date);
  }, [points]);

  const stats = useMemo(() => {
    if (points.length < 2) return null;
    const start = points[0]!.score;
    const end = points[points.length - 1]!.score;
    return { start, end, delta: end - start };
  }, [points]);

  if (isLoading && points.length < 2) {
    return <Skeleton className="h-52 w-full rounded-xl bg-muted/40 sm:h-60" />;
  }

  if (hasError) {
    return (
      <div className="flex h-52 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/5 px-3 sm:h-60">
        <p className="text-center text-xs text-amber-200">
          Score history temporarily unavailable.
        </p>
      </div>
    );
  }

  if (points.length < 2) {
    return (
      <div className="flex h-52 items-center justify-center rounded-xl border border-border/60 bg-muted/10 sm:h-60">
        <p className="text-xs text-muted-foreground">
          Not enough history to plot score trend.
        </p>
      </div>
    );
  }

  const stabilityKey: CopyTradeScoreStability | null = stability ?? null;
  const stabilityTone = stabilityKey ? STABILITY_TONE[stabilityKey] : null;
  const deltaTone =
    stats == null
      ? "text-foreground"
      : stats.delta > 0
        ? "text-emerald-300"
        : stats.delta < 0
          ? "text-rose-300"
          : "text-foreground";
  const deltaLabel =
    stats == null
      ? "—"
      : `${stats.delta > 0 ? "+" : ""}${stats.delta.toFixed(1)} pts`;

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {stabilityTone ? (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.18em]",
              stabilityTone.surface,
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", stabilityTone.dot)} />
            {stabilityTone.label}
          </span>
        ) : (
          <span className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Trend
          </span>
        )}
        <span
          className={cn("font-mono text-xs font-bold tabular-nums", deltaTone)}
          title="Change from start to end of selected window"
        >
          Δ {deltaLabel}
        </span>
      </div>

      <div className="h-52 w-full rounded-xl bg-muted/15 p-2 ring-1 ring-inset ring-border/35 sm:h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={points}
            margin={{ top: 16, right: 12, left: 2, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_GRID}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              ticks={tickDates}
              tickFormatter={(v) => formatShortDate(String(v))}
              tick={{ fill: CHART_TICK, fontSize: 10 }}
              axisLine={{ stroke: CHART_GRID }}
              tickLine={false}
              padding={{ left: 6, right: 6 }}
            />
            <YAxis
              domain={[0, 100]}
              width={32}
              tick={{ fill: CHART_TICK, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: CHART_POPOVER_BG,
                border: `1px solid ${CHART_GRID}`,
                borderRadius: "8px",
                fontSize: "11px",
              }}
              labelFormatter={(l) => formatShortDate(String(l))}
              formatter={(v: number) => [fmtCopyTradeScore(v), "Score"]}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke={CHART_ACCENT}
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 5,
                fill: CHART_ACCENT,
                stroke: CHART_BG,
                strokeWidth: 1,
              }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
