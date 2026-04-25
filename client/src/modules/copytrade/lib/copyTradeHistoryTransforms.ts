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

/**
 * Builds an equity curve from cumulative ROI % at each snapshot (notional base $1,000).
 */
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

export function formatShortDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-");
  if (!m || !d) return isoDate;
  return `${m}/${d}`;
}
