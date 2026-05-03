import {
  copyTradeHistoryApiResponseSchema,
  type CopyTradeHistoryRecord,
} from "@shared/types";

export type CopyTradeScoreTrendPoint = {
  date: string;
  score: number;
};

export type CopyTradePerformancePoint = {
  date: string;
  profitUsd: number;
  equity: number;
  roiPct: number;
};

export function parseCopyTradeHistoryPayload(
  payload: unknown,
): CopyTradeHistoryRecord[] {
  const parsed = copyTradeHistoryApiResponseSchema.safeParse(payload);
  if (!parsed.success) return [];
  return parsed.data.history;
}

function sortByDateAsc(
  records: CopyTradeHistoryRecord[],
): CopyTradeHistoryRecord[] {
  return [...records].sort((a, b) =>
    a.snapshot_date.localeCompare(b.snapshot_date),
  );
}

export function historyRecordsToScoreTrend(
  records: CopyTradeHistoryRecord[],
  field: "ema_score" | "raw_score" = "ema_score",
): CopyTradeScoreTrendPoint[] {
  return sortByDateAsc(records).map((r) => ({
    date: r.snapshot_date,
    score: Math.max(0, Math.min(100, Number(r[field]) || 0)),
  }));
}

/** Per snapshot: roiPct from roi_total_pct; equity/profit from optional notional base. */
export function historyRecordsToPerformancePoints(
  records: CopyTradeHistoryRecord[],
  startEquityUsd = 1000,
): CopyTradePerformancePoint[] {
  const sorted = sortByDateAsc(records);
  let prevEquity = startEquityUsd;
  return sorted.map((r, i) => {
    const roiPct = typeof r.roi_total_pct === "number" ? r.roi_total_pct : 0;
    const equity = startEquityUsd * (1 + roiPct / 100);
    const profitUsd = i === 0 ? equity - startEquityUsd : equity - prevEquity;
    prevEquity = equity;
    return {
      date: r.snapshot_date,
      profitUsd,
      equity,
      roiPct,
    };
  });
}

export function formatCopyTradeChartDate(isoDate: string): string {
  const trimmed = isoDate.trim();
  const day = trimmed.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(day)) return day;
  const ms = Date.parse(trimmed);
  if (!Number.isNaN(ms)) return new Date(ms).toISOString().slice(0, 10);
  return trimmed;
}

/** Score chart Y domain: min/max ± pad, clamped 0–100. */
export function scoreTrendYDomain(
  scores: readonly number[],
  pad = 5,
): [number, number] {
  if (scores.length === 0) return [0, 100];
  let lo = Math.min(...scores);
  let hi = Math.max(...scores);
  if (lo === hi) {
    lo -= pad;
    hi += pad;
  }
  return [
    Math.max(0, Math.floor(lo - pad)),
    Math.min(100, Math.ceil(hi + pad)),
  ];
}

/** ROI % chart Y domain: min/max ± pad (percentage points); negatives allowed. */
export function cumulativeRoiTrendYDomain(
  roiPcts: readonly number[],
  pad = 5,
): [number, number] {
  if (roiPcts.length === 0) return [-pad, pad];
  let lo = Math.min(...roiPcts);
  let hi = Math.max(...roiPcts);
  if (lo === hi) {
    lo -= pad;
    hi += pad;
  }
  return [lo - pad, hi + pad];
}
