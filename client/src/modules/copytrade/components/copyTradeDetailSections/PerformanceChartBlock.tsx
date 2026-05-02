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
import { formatShortDate } from "../../lib/copyTradeHistoryTransforms";

const CHART_ACCENT = "hsl(var(--primary))";
const CHART_GRID = "hsl(var(--border))";
const CHART_TICK = "hsl(var(--muted-foreground))";
const CHART_POPOVER_BG = "hsl(var(--popover))";

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
  const stats = useMemo(() => {
    if (points.length < 2) return null;
    const startEq = points[0]!.equity;
    const endEq = points[points.length - 1]!.equity;
    const totalProfit = endEq - startEq;
    const roiPct = startEq > 0 ? (totalProfit / startEq) * 100 : 0;
    return { startEq, endEq, totalProfit, roiPct };
  }, [points]);

  if (isLoading && points.length < 2) {
    return <Skeleton className="h-44 w-full rounded-lg bg-muted/40" />;
  }

  if (hasError) {
    return (
      <div className="flex h-44 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/5 px-3">
        <p className="text-center text-xs text-amber-200">
          Performance history unavailable.
        </p>
      </div>
    );
  }

  if (points.length < 2) {
    return (
      <div className="flex h-44 items-center justify-center rounded-lg border border-border bg-background">
        <p className="text-xs text-muted-foreground">No ROI history to chart yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {stats ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Equity curve
          </span>
          <span
            className={cn(
              "font-mono text-xs font-bold tabular-nums",
              stats.totalProfit >= 0 ? "text-emerald-300" : "text-rose-300",
            )}
          >
            {stats.roiPct > 0 ? "+" : ""}
            {stats.roiPct.toFixed(1)}%
          </span>
        </div>
      ) : null}

      <div className="h-44 w-full rounded-lg border border-border bg-background p-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={points}
            margin={{ top: 8, right: 8, left: 2, bottom: 4 }}
          >
            <defs>
              <linearGradient id="copytradePerfFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_ACCENT} stopOpacity={0.35} />
                <stop offset="100%" stopColor={CHART_ACCENT} stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
            <XAxis
              dataKey="date"
              tickFormatter={(v) => formatShortDate(String(v))}
              tick={{ fill: CHART_TICK, fontSize: 9 }}
              axisLine={{ stroke: CHART_GRID }}
              tickLine={false}
              interval="preserveStartEnd"
              padding={{ left: 6, right: 6 }}
            />
            <YAxis
              tick={{ fill: CHART_TICK, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) =>
                v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${Math.round(v)}`
              }
            />
            <Tooltip
              contentStyle={{
                background: CHART_POPOVER_BG,
                border: `1px solid ${CHART_GRID}`,
                borderRadius: "8px",
                fontSize: "11px",
              }}
              formatter={(v: number, name: string) => [
                name === "equity" ? `$${v.toFixed(0)}` : v,
                name === "equity" ? "Equity" : name,
              ]}
              labelFormatter={(l) => formatShortDate(String(l))}
            />
            <Area
              type="monotone"
              dataKey="equity"
              stroke={CHART_ACCENT}
              strokeWidth={2}
              fill="url(#copytradePerfFill)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
