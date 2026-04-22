import { useMemo, useState } from "react";
import { Sparkles, Activity, ShieldAlert, RefreshCw, X } from "lucide-react";
import type { CopyTradeTrader } from "@shared/types";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fmtCopyTradeMomentum, fmtCopyTradeScore, fmtCopyTradeUpdated } from "../lib/copyTradeFormat";
import type { CopyTradeTraderDetail } from "../lib/copyTradeDetail";
import {
  CopyTradeConfidenceBadge,
  CopyTradeGradeBadge,
  CopyTradeSignalBadge,
  CopyTradeStatusBadge,
} from "../lib/copyTradeBadges";

type CopyTradeDetailPanelProps = {
  selectedTrader?: CopyTradeTrader;
  detail?: CopyTradeTraderDetail;
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  onRetry: () => void;
  onClose: () => void;
  hasLiveHistory30?: boolean;
  hasLiveHistory90?: boolean;
  hasHistoryError30?: boolean;
  hasHistoryError90?: boolean;
};

function MetricCard({ label, value, tone = "text-foreground" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-xl border border-[#222]/80 bg-[#101010]/90 px-3 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className={cn("mt-1 font-mono text-base font-semibold", tone)}>{value}</p>
    </div>
  );
}

export function CopyTradeDetailPanel({
  selectedTrader,
  detail,
  isLoading,
  isError,
  error,
  onRetry,
  onClose,
  hasLiveHistory30 = false,
  hasLiveHistory90 = false,
  hasHistoryError30 = false,
  hasHistoryError90 = false,
}: CopyTradeDetailPanelProps) {
  const [historyRange, setHistoryRange] = useState<30 | 90>(30);

  const historySeries = useMemo(() => {
    if (!detail) return [];
    return historyRange === 30 ? detail.history30d : detail.history90d;
  }, [detail, historyRange]);
  const historyChartData = useMemo(
    () => historySeries.map((score, idx) => ({ idx, score })),
    [historySeries],
  );
  const usingLiveHistory = historyRange === 30 ? hasLiveHistory30 : hasLiveHistory90;
  const hasHistoryError = historyRange === 30 ? hasHistoryError30 : hasHistoryError90;

  const historyStats = useMemo(() => {
    if (historySeries.length === 0) return null;
    const min = Math.min(...historySeries);
    const max = Math.max(...historySeries);
    const span = max - min;
    const flat = span < 0.25;
    const points = flat
      ? historySeries.filter((_, i) => i % Math.max(1, Math.floor(historySeries.length / 8)) === 0)
      : [];
    return { min, max, span, flat, points };
  }, [historySeries]);

  if (!selectedTrader) {
    return (
      <aside className="h-full rounded-none border-l border-[#242424] bg-gradient-to-b from-[#101010] to-[#090909] p-5">
        <div className="mb-3 flex items-center justify-end">
          <button
            type="button"
            aria-label="Close panel"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-[#1a1a1a] hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-[#C7AE6A]">
          <Sparkles className="h-4 w-4" />
          <p className="text-xs font-black uppercase tracking-[0.2em]">Detail Console</p>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Select any trader row to open the live intelligence panel with scores, quality signals, and vendor context.
        </p>
      </aside>
    );
  }

  if (isLoading || !detail) {
    return (
      <aside className="h-full rounded-none border-l border-[#242424] bg-[#0b0b0b]/95 p-5">
        <div className="mb-3 flex items-center justify-end">
          <button
            type="button"
            aria-label="Close panel"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-[#1a1a1a] hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#C7AE6A]">Loading Detail</p>
        <div className="mt-4 space-y-2">
          <div className="h-5 w-2/3 animate-pulse rounded bg-[#1b1b1b]" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-[#171717]" />
          <div className="mt-4 grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-[#151515]" />
            ))}
          </div>
        </div>
      </aside>
    );
  }

  if (isError) {
    return (
      <aside className="h-full rounded-none border-l border-rose-500/30 bg-rose-500/10 p-5">
        <div className="mb-3 flex items-center justify-end">
          <button
            type="button"
            aria-label="Close panel"
            onClick={onClose}
            className="rounded-md p-1.5 text-rose-200 hover:bg-rose-500/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-rose-300">
          <ShieldAlert className="h-4 w-4" />
          <p className="text-xs font-black uppercase tracking-[0.2em]">Detail Error</p>
        </div>
        <p className="mt-3 text-xs text-rose-200">
          {error instanceof Error ? error.message : "Could not load trader detail."}
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="mt-3 border-rose-300/40 text-rose-200 hover:bg-rose-500/20"
          onClick={onRetry}
        >
          <RefreshCw className="mr-2 h-3.5 w-3.5" />
          Retry
        </Button>
      </aside>
    );
  }

  const momentumTone = detail.momentum >= 0 ? "text-chart-4" : "text-destructive";

  return (
    <aside className="h-full overflow-y-auto rounded-none border-l border-[#242424] bg-gradient-to-b from-[#0f0f10] to-[#090909] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
      <div className="mb-2 flex items-center justify-end">
        <button
          type="button"
          aria-label="Close panel"
          onClick={onClose}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-[#1a1a1a] hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C7AE6A]">Trader Intelligence</p>
          <h3 className="truncate text-xl font-black text-foreground">{detail.handle}</h3>
          <p className="font-mono text-xs text-muted-foreground">{detail.traderId}</p>
        </div>
        <div className="mt-0.5">
          <Activity className="h-4 w-4 text-[#C7AE6A]" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        <CopyTradeGradeBadge grade={detail.grade} />
        <CopyTradeConfidenceBadge band={detail.confidenceBand} />
        <CopyTradeSignalBadge state={detail.signalState} />
        <CopyTradeStatusBadge status={detail.lifecycleState} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <MetricCard label="Rank" value={`#${detail.computedRank}`} />
        <MetricCard label="Rank 7d" value={detail.rankChange7d > 0 ? `+${detail.rankChange7d}` : String(detail.rankChange7d)} />
        <MetricCard label="Score" value={fmtCopyTradeScore(detail.score)} />
        <MetricCard label="Momentum" value={fmtCopyTradeMomentum(detail.momentum)} tone={momentumTone} />
      </div>

      <div className="mt-4 rounded-xl border border-[#222]/80 bg-[#0f0f0f] p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Score Trend
          </p>
          <div className="inline-flex rounded-md border border-[#242424] bg-[#121212] p-0.5">
            <button
              type="button"
              onClick={() => setHistoryRange(30)}
              className={cn(
                "rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
                historyRange === 30
                  ? "bg-[#C7AE6A] text-black"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              30D
            </button>
            <button
              type="button"
              onClick={() => setHistoryRange(90)}
              className={cn(
                "rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
                historyRange === 90
                  ? "bg-[#C7AE6A] text-black"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              90D
            </button>
          </div>
        </div>
        <p className="mt-1 text-[10px] font-medium text-muted-foreground">
          {usingLiveHistory ? "Live history source" : "Fallback trend (history API pending data)"}
        </p>
        {hasHistoryError ? (
          <div className="mt-1 rounded border border-amber-500/35 bg-amber-500/10 px-2 py-1">
            <p className="text-[10px] font-semibold text-amber-200">
              History temporarily unavailable for this range.
            </p>
          </div>
        ) : null}
        <div className="mt-2 rounded-lg border border-[#1b1b1b] bg-[#0b0b0b] p-2">
          {historyChartData.length > 1 ? (
            <div className="h-16 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={historyChartData}
                  margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
                >
                  <defs>
                    <linearGradient id="copytradeScoreFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C7AE6A" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#C7AE6A" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    cursor={false}
                    contentStyle={{
                      background: "#0d0d0d",
                      border: "1px solid #2a2a2a",
                      borderRadius: "8px",
                      color: "#ddd",
                      fontSize: "11px",
                    }}
                    labelFormatter={() => ""}
                    formatter={(value: number) => [`${Number(value).toFixed(2)}`, "Score"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#C7AE6A"
                    strokeWidth={2.2}
                    fill="url(#copytradeScoreFill)"
                    dot={historyStats?.flat ? { r: 1.6, fill: "#C7AE6A", stroke: "none" } : false}
                    activeDot={{ r: 2.4, fill: "#C7AE6A", stroke: "#0b0b0b", strokeWidth: 1 }}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-16 items-center justify-center">
              <p className="text-[10px] text-muted-foreground">No trend points available</p>
            </div>
          )}
          {historyStats?.flat ? (
            <p className="mt-1 text-[10px] text-muted-foreground">
              Trend is currently flat (minimal score movement).
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-[#202020] bg-[#101010]/80 p-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Summary</p>
        <p className="mt-2 text-sm leading-relaxed text-foreground/85">{detail.summary}</p>
        <p className="mt-2 font-mono text-[11px] text-muted-foreground">
          Last seen: {fmtCopyTradeUpdated(detail.lastSeenAt)}
        </p>
      </div>

      {detail.subscores.length > 0 ? (
        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Score Drivers</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {detail.subscores.slice(0, 6).map((metric) => (
              <MetricCard key={metric.label} label={metric.label} value={metric.value} />
            ))}
          </div>
        </div>
      ) : null}

      {detail.vendorMetrics.length > 0 ? (
        <div className="mt-4 rounded-xl border border-[#1f1f1f] bg-[#0f0f0f] p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Vendor Context</p>
          <div className="mt-2 space-y-1.5">
            {detail.vendorMetrics.slice(0, 6).map((metric) => (
              <div key={metric.label} className="flex items-center justify-between gap-3 text-xs">
                <span className="text-muted-foreground">{metric.label}</span>
                <span className="font-mono text-foreground">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {detail.flags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {detail.flags.map((flag) => (
            <span
              key={flag}
              className="rounded-full border border-[#2a2a2a] bg-[#151515] px-2.5 py-1 text-[10px] font-medium text-muted-foreground"
            >
              {flag}
            </span>
          ))}
        </div>
      ) : null}
    </aside>
  );
}
