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
    return { startEq, endEq, totalProfit };
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
    <div>
      <div className="h-44 w-full rounded-lg border border-border bg-background p-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={points}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
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
      {stats ? (
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          <span className="text-muted-foreground">
            Start:{" "}
            <span className="font-mono font-semibold text-foreground">
              $
              {stats.startEq.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </span>
          </span>
          <span className="text-muted-foreground">
            End:{" "}
            <span className="font-mono font-semibold text-foreground">
              $
              {stats.endEq.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </span>
          </span>
          <span className="text-muted-foreground">
            Total P/L:{" "}
            <span
              className={cn(
                "font-mono font-bold",
                stats.totalProfit >= 0 ? "text-emerald-400" : "text-rose-400",
              )}
            >
              {stats.totalProfit >= 0 ? "+" : ""}$
              {Math.round(stats.totalProfit).toLocaleString()}
            </span>
          </span>
        </div>
      ) : null}
      <p className="mt-2 text-xs font-medium text-muted-foreground">
        Performance curve rendered from backend ROI history snapshots.
      </p>
    </div>
  );
}
