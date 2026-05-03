import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { CopyTradePerformancePoint } from "../../lib/copyTradeHistoryTransforms";
import {
  cumulativeRoiTrendYDomain,
  formatCopyTradeChartDate,
} from "../../lib/copyTradeHistoryTransforms";

const CHART_ACCENT = "hsl(var(--primary))";
const CHART_GRID = "hsl(var(--border))";
const CHART_TICK = "hsl(var(--muted-foreground))";
const CHART_POPOVER_BG = "hsl(var(--popover))";
const CHART_BG = "hsl(var(--background))";

const ROI_Y_PAD = 5;

type PerformanceChartBlockProps = {
  points: CopyTradePerformancePoint[];
  isLoading: boolean;
  hasError: boolean;
};

export function PerformanceChartBlock({
  points,
  isLoading,
  hasError,
}: PerformanceChartBlockProps) {
  const yDomain = useMemo(
    () =>
      cumulativeRoiTrendYDomain(
        points.map((p) => p.roiPct),
        ROI_Y_PAD,
      ),
    [points],
  );

  const stats = useMemo(() => {
    if (points.length < 2) return null;
    const startRoi = points[0]!.roiPct;
    const endRoi = points[points.length - 1]!.roiPct;
    return { startRoi, endRoi, delta: endRoi - startRoi };
  }, [points]);

  const chartShell =
    "relative h-52 w-full shrink-0 rounded-xl bg-muted/15 p-2 ring-1 ring-inset ring-border/35 sm:h-60";

  if (isLoading && points.length < 2) {
    return (
      <div className="flex min-h-0 w-full flex-1 flex-col gap-y-3">
        <div className="min-h-0 flex-1" aria-hidden />
        <Skeleton className={cn(chartShell, "animate-pulse bg-muted/40")} />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex min-h-0 w-full flex-1 flex-col gap-y-3">
        <div className="min-h-0 flex-1" aria-hidden />
        <div
          className={cn(
            chartShell,
            "flex items-center justify-center border border-amber-500/30 bg-amber-500/5 px-3",
          )}
        >
          <p className="text-center text-xs text-amber-200">
            Performance history unavailable.
          </p>
        </div>
      </div>
    );
  }

  if (points.length < 2) {
    return (
      <div className="flex min-h-0 w-full flex-1 flex-col gap-y-3">
        <div className="min-h-0 flex-1" aria-hidden />
        <div
          className={cn(chartShell, "flex items-center justify-center border border-border/60 bg-muted/10")}
        >
          <p className="text-xs text-muted-foreground">Not enough history to plot ROI.</p>
        </div>
      </div>
    );
  }

  const deltaTone =
    stats == null
      ? "text-foreground"
      : stats.delta > 0
        ? "text-emerald-300"
        : stats.delta < 0
          ? "text-rose-300"
          : "text-muted-foreground";

  const deltaLabel =
    stats == null
      ? "—"
      : `${stats.delta > 0 ? "+" : ""}${stats.delta.toFixed(1)}%`;

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-y-3">
      <div className="flex w-full shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 pb-0.5">
        <span className="text-xs font-black uppercase tracking-wider text-primary/95">
          Cumulative ROI
        </span>
        <span
          className={cn(
            "ml-auto shrink-0 font-mono text-xs font-bold tabular-nums",
            deltaTone,
          )}
          title="Change in cumulative ROI % from first to last snapshot in the selected window"
        >
          Δ {deltaLabel}
        </span>
      </div>

      <div className="min-h-0 flex-1" aria-hidden />

      <div className={chartShell}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={points}
            margin={{ top: 22, right: 12, left: 2, bottom: 8 }}
          >
            <defs>
              <linearGradient id="copytradeRoiTrendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_ACCENT} stopOpacity={0.38} />
                <stop offset="100%" stopColor={CHART_ACCENT} stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
            <XAxis dataKey="date" hide />
            <YAxis
              domain={yDomain}
              width={40}
              tick={{ fill: CHART_TICK, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${Math.round(v)}%`}
            />
            <Tooltip
              contentStyle={{
                background: CHART_POPOVER_BG,
                border: `1px solid ${CHART_GRID}`,
                borderRadius: "8px",
                fontSize: "11px",
              }}
              labelFormatter={(l) => formatCopyTradeChartDate(String(l))}
              formatter={(v: number) => [
                `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`,
                "Cumulative ROI",
              ]}
            />
            <Area
              type="monotone"
              dataKey="roiPct"
              stroke={CHART_ACCENT}
              strokeWidth={2}
              fill="url(#copytradeRoiTrendFill)"
              dot={false}
              activeDot={{
                r: 5,
                fill: CHART_ACCENT,
                stroke: CHART_BG,
                strokeWidth: 1,
              }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
