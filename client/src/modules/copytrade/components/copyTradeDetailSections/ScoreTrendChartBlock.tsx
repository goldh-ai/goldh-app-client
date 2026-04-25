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
import { fmtCopyTradeScore } from "../../lib/copyTradeFormat";
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
};

export function ScoreTrendChartBlock({
  points,
  isLoading,
  hasError,
}: ScoreTrendChartBlockProps) {
  const tickDates = useMemo(() => {
    if (points.length === 0) return [];
    return points
      .filter((_, i) => i % 5 === 0 || i === points.length - 1)
      .map((p) => p.date);
  }, [points]);

  const lastScore = points.length ? points[points.length - 1]!.score : null;

  if (isLoading && points.length < 2) {
    return <Skeleton className="h-44 w-full rounded-lg bg-muted/40" />;
  }

  if (hasError) {
    return (
      <div className="flex h-44 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/5 px-3">
        <p className="text-center text-xs text-amber-200">
          Score history temporarily unavailable.
        </p>
      </div>
    );
  }

  if (points.length < 2) {
    return (
      <div className="flex h-44 items-center justify-center rounded-lg border border-border bg-background">
        <p className="text-xs text-muted-foreground">
          Not enough history to plot score trend.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="h-44 w-full rounded-lg border border-border bg-background p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={points}
            margin={{ top: 16, right: 12, left: 0, bottom: 4 }}
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
      <p className="mt-2 text-xs font-medium text-muted-foreground">
        Trend points plotted directly from backend history snapshots.
      </p>
      {lastScore != null ? (
        <p className="mt-1 font-mono text-xs text-primary/80">
          Current score (last point): {fmtCopyTradeScore(lastScore)}
        </p>
      ) : null}
    </div>
  );
}
